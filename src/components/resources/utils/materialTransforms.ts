
import { Material, MaterialBatch } from "@/types/material";
import { RawMaterialFromDB } from "../types/materialTypes";

export const transformMaterialWithBatches = (
  rawMaterial: RawMaterialFromDB,
  batches: MaterialBatch[]
): Material => {
  const materialBatches = batches
    .filter((b) => b.materialId === rawMaterial.id)
    .map((b) => ({
      id: b.id,
      materialId: b.materialId,
      batchNumber: b.batchNumber,
      initialStock: b.initialStock,
      remainingStock: b.remainingStock,
      costPerUnit: b.costPerUnit,
      purchaseDate: b.purchaseDate,
      deliveredDate: b.deliveredDate || null, // Include the deliveredDate field
      status: b.status || 'received' // Include the status field
    }));
    
  const totalRemainingStock = materialBatches.reduce(
    (sum, batch) => sum + Number(batch.remainingStock), 
    0
  );
  
  const totalCost = materialBatches.reduce(
    (sum, batch) => sum + (Number(batch.remainingStock) * Number(batch.costPerUnit)), 
    0
  );
  
  const avgCostPerUnit = totalRemainingStock > 0 
    ? totalCost / totalRemainingStock 
    : 0;
  
  return {
    id: rawMaterial.id,
    name: rawMaterial.name,
    unit: rawMaterial.unit,
    category: rawMaterial.category || "",
    status: rawMaterial.status || "Active",
    vendor: rawMaterial.vendor || "",
    batches: materialBatches,
    stock: totalRemainingStock,
    costPerUnit: avgCostPerUnit
  };
};
