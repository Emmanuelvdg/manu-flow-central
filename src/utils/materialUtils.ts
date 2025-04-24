
import { MaterialBatch } from "@/types/material";

export const getFIFOBatches = (batches: MaterialBatch[]): MaterialBatch[] => {
  // Sort batches by delivery date (if available) or purchase date
  return [...batches].sort((a, b) => {
    const dateA = new Date(a.deliveredDate || a.purchaseDate);
    const dateB = new Date(b.deliveredDate || b.purchaseDate);
    return dateA.getTime() - dateB.getTime();
  });
};

export const calculateOrderMaterialStatus = (
  requiredQuantity: number,
  batches: MaterialBatch[]
): 'booked' | 'expected' | 'requested' | 'not enough' => {
  const sortedBatches = getFIFOBatches(batches);
  let totalAvailable = 0;
  let hasExpected = false;
  let hasRequested = false;

  for (const batch of sortedBatches) {
    if (batch.status === 'received') {
      totalAvailable += batch.remainingStock;
    } else if (batch.status === 'expected') {
      hasExpected = true;
      totalAvailable += batch.initialStock; // Consider expected stock
    } else if (batch.status === 'requested') {
      hasRequested = true;
      totalAvailable += batch.initialStock; // Consider requested stock
    }
  }

  if (totalAvailable < requiredQuantity) {
    return 'not enough';
  }

  // If we have enough received stock, mark as booked
  let receivedStock = sortedBatches
    .filter(b => b.status === 'received')
    .reduce((sum, b) => sum + b.remainingStock, 0);

  if (receivedStock >= requiredQuantity) {
    return 'booked';
  }

  // If we have some expected batches, mark as expected
  if (hasExpected) {
    return 'expected';
  }

  // If we have some requested batches, mark as requested
  if (hasRequested) {
    return 'requested';
  }

  return 'not enough';
};

export const updateOrderMaterialsStatus = async (
  orderProducts: any[], 
  materials: { [key: string]: MaterialBatch[] }
): Promise<string> => {
  let overallStatus = 'booked';

  for (const product of orderProducts) {
    if (!product.materials) continue;

    for (const material of product.materials) {
      const materialBatches = materials[material.materialId] || [];
      const status = calculateOrderMaterialStatus(
        material.quantity,
        materialBatches
      );

      // Update overall status based on priority
      if (status === 'not enough') {
        return 'not enough';
      } else if (status === 'requested' && overallStatus !== 'not enough') {
        overallStatus = 'requested';
      } else if (status === 'expected' && overallStatus !== 'not enough' && overallStatus !== 'requested') {
        overallStatus = 'expected';
      }
    }
  }

  return overallStatus;
};
