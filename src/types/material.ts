
export interface MaterialBatch {
  id: string;
  materialId: string;
  batchNumber: string;
  initialStock: number;
  remainingStock: number;
  costPerUnit: number;
  purchaseDate: string;
  deliveredDate: string | null;
  status: 'requested' | 'expected' | 'delayed' | 'received';
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  status: string;
  vendor: string;
  stock: number;
  costPerUnit: number;
  batches?: MaterialBatch[];
}

export interface PurchaseOrder {
  id: string;
  materialId: string;
  quantity: number;
  status: string;
  orderDate: string;
  expectedDelivery: string;
  vendor: string;
  totalCost: number;
}
