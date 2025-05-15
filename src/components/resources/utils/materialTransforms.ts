
import { Material, MaterialBatch } from "@/types/material";
import { RawMaterialFromDB } from "../types/materialTypes";

// Helper function to transform a raw material from DB to the format used in the app
export const transformMaterialWithBatches = (
  rawMaterial: RawMaterialFromDB,
  materialBatches: any[]
): Material => {
  // Filter batches for this material
  const batches = materialBatches
    .filter(batch => batch.material_id === rawMaterial.id)
    .map(batch => ({
      id: batch.id,
      materialId: batch.material_id,
      batchNumber: batch.batch_number,
      initialStock: Number(batch.initial_stock),
      remainingStock: Number(batch.remaining_stock),
      costPerUnit: Number(batch.cost_per_unit),
      purchaseDate: batch.purchase_date,
      expiryDate: batch.expiry_date,
      deliveredDate: null, // This would need to be added to the DB schema if needed
      status: batch.status
    })) as MaterialBatch[];
  
  // Calculate total stock and average cost per unit
  const totalRemainingStock = batches.reduce(
    (sum, batch) => sum + batch.remainingStock, 0
  );
  
  const totalCost = batches.reduce(
    (sum, batch) => sum + (batch.remainingStock * batch.costPerUnit), 0
  );
  
  const avgCostPerUnit = totalRemainingStock > 0 ? totalCost / totalRemainingStock : 0;
  
  return {
    id: rawMaterial.id,
    name: rawMaterial.name,
    category: rawMaterial.category || '',
    unit: rawMaterial.unit,
    status: rawMaterial.status || 'Active',
    vendor: rawMaterial.vendor || '',
    stock: totalRemainingStock,
    costPerUnit: avgCostPerUnit,
    abcClassification: rawMaterial.abc_classification || 'C',
    batches
  };
};
