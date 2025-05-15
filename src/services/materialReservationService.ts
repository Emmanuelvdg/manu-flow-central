import { supabase } from "@/integrations/supabase/client";
import { calculateOrderMaterialStatus } from "@/utils/materialUtils";
import { MaterialBatch } from "@/types/material";
import { toast } from "@/components/ui/use-toast";

export type ReservationStatus = 'not booked' | 'not enough' | 'requested' | 'expected' | 'delayed' | 'booked' | 'error';

export const checkMaterialAvailability = async (
  orderProducts: any[],
  materialBatches: { [key: string]: MaterialBatch[] }
): Promise<ReservationStatus> => {
  try {
    let hasDelayed = false;
    let hasRequested = false;
    let hasExpected = false;
    let hasEnoughStock = true;

    for (const product of orderProducts) {
      if (!product.materials) continue;

      for (const material of product.materials) {
        const materialBatchList = materialBatches[material.materialId] || [];
        const status = calculateOrderMaterialStatus(material.quantity, materialBatchList);

        // Update flags based on material status
        if (status === 'not enough') {
          hasEnoughStock = false;
          break;
        } else if (materialBatchList.some(b => b.status === 'delayed')) {
          hasDelayed = true;
        } else if (status === 'requested') {
          hasRequested = true;
        } else if (status === 'expected') {
          hasExpected = true;
        }
      }

      if (!hasEnoughStock) break;
    }

    // Determine overall status based on priority
    if (!hasEnoughStock) return 'not enough';
    if (hasDelayed) return 'delayed';
    if (hasRequested) return 'requested';
    if (hasExpected) return 'expected';
    if (hasEnoughStock) return 'booked';
    return 'not booked';
  } catch (error) {
    console.error('Error checking material availability:', error);
    return 'error';
  }
};

export const updateOrderMaterialStatus = async (
  orderId: string,
  status: ReservationStatus
): Promise<void> => {
  try {
    // Normalize status format for consistency across the application
    // This ensures the status is stored consistently in the database
    const normalizedStatus = status.toLowerCase();
    
    await supabase
      .from('orders')
      .update({ parts_status: normalizedStatus })
      .eq('id', orderId);
      
    console.log(`Updated order ${orderId} parts_status to: ${normalizedStatus}`);

    // If status is "booked", allocate materials from stock
    if (normalizedStatus === 'booked') {
      await allocateOrderMaterials(orderId);
    }
  } catch (error) {
    console.error('Error updating order material status:', error);
    throw error;
  }
};

export const allocateOrderMaterials = async (orderId: string): Promise<boolean> => {
  try {
    // Get order products with materials
    const { data: orderProducts, error: orderError } = await supabase
      .from('order_products')
      .select('id, product_id, quantity, materials_status')
      .eq('order_id', orderId);

    if (orderError) {
      console.error('Error fetching order products:', orderError);
      return false;
    }

    // Get order materials
    const { data: orderMaterials, error: materialsError } = await supabase
      .from('order_materials')
      .select('*')
      .in('order_product_id', orderProducts.map(p => p.id));

    if (materialsError) {
      console.error('Error fetching order materials:', materialsError);
      return false;
    }

    // Get material batches
    const { data: batches, error: batchesError } = await supabase
      .from('material_batches')
      .select('*')
      .eq('status', 'received')
      .order('purchase_date', { ascending: true });

    if (batchesError) {
      console.error('Error fetching material batches:', batchesError);
      return false;
    }

    // Group batches by material ID
    const batchesByMaterial = batches.reduce((acc, batch) => {
      if (!acc[batch.material_id]) {
        acc[batch.material_id] = [];
      }
      acc[batch.material_id].push({
        id: batch.id,
        materialId: batch.material_id,
        batchNumber: batch.batch_number,
        initialStock: batch.initial_stock,
        remainingStock: batch.remaining_stock,
        costPerUnit: batch.cost_per_unit,
        purchaseDate: batch.purchase_date,
        expiryDate: batch.expiry_date,
        deliveredDate: null,
        status: batch.status
      });
      return acc;
    }, {} as { [key: string]: MaterialBatch[] });

    // Allocate materials using FIFO
    const allocations = [];
    const batchUpdates = [];

    for (const material of orderMaterials) {
      if (material.status !== 'booked') continue;

      const materialBatches = batchesByMaterial[material.material_id] || [];
      const { batchAllocations, updatedBatches } = allocateMaterialBatches(
        material.material_id, 
        material.quantity, 
        materialBatches
      );
      
      if (batchAllocations.length > 0) {
        // Create material allocations for the batch
        for (const allocation of batchAllocations) {
          allocations.push({
            order_id: orderId,
            material_id: material.material_id,
            quantity: allocation.quantity,
            allocation_type: 'booked'
          });
        }
        
        // Add batch updates
        batchUpdates.push(...updatedBatches);
      }
    }

    // Save batch updates to database
    if (batchUpdates.length > 0) {
      for (const batch of batchUpdates) {
        const { error: updateError } = await supabase
          .from('material_batches')
          .update({ remaining_stock: batch.remainingStock })
          .eq('id', batch.id);
        
        if (updateError) {
          console.error('Error updating batch:', updateError);
          return false;
        }
      }
    }

    // Save allocations to database
    if (allocations.length > 0) {
      const { error: allocError } = await supabase
        .from('material_allocations')
        .insert(allocations);
      
      if (allocError) {
        console.error('Error saving allocations:', allocError);
        return false;
      }
    }

    // Update order materials as allocated
    if (orderMaterials.length > 0) {
      const { error: updateError } = await supabase
        .from('order_materials')
        .update({ allocated: true })
        .in('id', orderMaterials.filter(m => m.status === 'booked').map(m => m.id));
      
      if (updateError) {
        console.error('Error updating order materials:', updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error allocating materials:', error);
    return false;
  }
};

type BatchAllocation = {
  batchId: string;
  quantity: number;
};

export const allocateMaterialBatches = (
  materialId: string,
  requiredQuantity: number,
  batches: MaterialBatch[]
): { batchAllocations: BatchAllocation[], updatedBatches: MaterialBatch[] } => {
  // Sort by FIFO principle
  const sortedBatches = [...batches].sort((a, b) => {
    const dateA = new Date(a.purchaseDate);
    const dateB = new Date(b.purchaseDate);
    return dateA.getTime() - dateB.getTime();
  });
  
  const batchAllocations: BatchAllocation[] = [];
  const updatedBatches: MaterialBatch[] = [];
  let remainingToAllocate = requiredQuantity;

  for (const batch of sortedBatches) {
    // Skip batches with no stock
    if (batch.remainingStock <= 0) continue;
    
    // Determine how much we can take from this batch
    const quantityFromBatch = Math.min(batch.remainingStock, remainingToAllocate);
    
    if (quantityFromBatch > 0) {
      // Create allocation record
      batchAllocations.push({
        batchId: batch.id,
        quantity: quantityFromBatch
      });
      
      // Update batch
      const updatedBatch = { ...batch };
      updatedBatch.remainingStock -= quantityFromBatch;
      updatedBatches.push(updatedBatch);
      
      // Reduce remaining quantity
      remainingToAllocate -= quantityFromBatch;
      
      // Break if we've allocated everything
      if (remainingToAllocate <= 0) break;
    }
  }
  
  return { batchAllocations, updatedBatches };
};
