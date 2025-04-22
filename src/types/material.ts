
export interface MaterialBatch {
  id: string;
  materialId: string;
  batchNumber: string;
  initialStock: number;
  remainingStock: number;
  costPerUnit: number;
  purchaseDate: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  status: string;
  vendor: string;
  costPerUnit?: number; // Added this property
  stock?: number;       // Added this property for backward compatibility
  batches?: MaterialBatch[];
}

export interface PurchaseOrder {
  id: string;
  materialId: string;
  quantity: number;
  status: string;
  orderDate: string;
  expectedDelivery?: string;
  vendor: string;
  totalCost: number;
}
