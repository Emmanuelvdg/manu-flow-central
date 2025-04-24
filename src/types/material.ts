
export interface MaterialBatch {
  id: string;
  materialId: string;
  batchNumber: string;
  initialStock: number;
  remainingStock: number;
  costPerUnit: number;
  purchaseDate: string;
  status: 'requested' | 'expected' | 'delayed' | 'received';
}
