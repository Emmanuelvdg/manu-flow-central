
import { Material, MaterialBatch } from "@/types/material";
import { RawMaterialFromDB } from "../types/materialTypes";

// Helper function to transform a raw material from DB to the format used in the app
export const transformMaterialWithBatches = (
  rawMaterial: RawMaterialFromDB,
  materialBatches: MaterialBatch[]
): Material => {
  // Filter batches for this material
  const batches = materialBatches
    .filter(batch => batch.materialId === rawMaterial.id)
    .map(batch => ({
      id: batch.id,
      materialId: batch.materialId,
      batchNumber: batch.batchNumber,
      initialStock: Number(batch.initialStock),
      remainingStock: Number(batch.remainingStock),
      costPerUnit: Number(batch.costPerUnit),
      purchaseDate: batch.purchaseDate,
      expiryDate: batch.expiryDate,
      deliveredDate: null,
      status: batch.status
    })) as MaterialBatch[];
  
  console.log(`Calculating totals for ${rawMaterial.name} with ${batches.length} batches`);
  
  // Calculate total stock and average cost per unit
  const totalRemainingStock = batches.reduce(
    (sum, batch) => sum + Number(batch.remainingStock), 0
  );
  
  const totalCost = batches.reduce(
    (sum, batch) => sum + (Number(batch.remainingStock) * Number(batch.costPerUnit)), 0
  );
  
  const avgCostPerUnit = totalRemainingStock > 0 ? totalCost / totalRemainingStock : 0;
  
  console.log(`Material ${rawMaterial.name}: Total stock: ${totalRemainingStock}, Avg cost: ${avgCostPerUnit}`);
  
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
