
import { supabase } from "@/integrations/supabase/client";
import { calculateOrderMaterialStatus } from "@/utils/materialUtils";
import { MaterialBatch } from "@/types/material";

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
    await supabase
      .from('orders')
      .update({ parts_status: status })
      .eq('id', orderId);
  } catch (error) {
    console.error('Error updating order material status:', error);
    throw error;
  }
};
