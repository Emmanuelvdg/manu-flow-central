
export interface Material {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: string;
  vendor: string;
  costPerUnit?: number;
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
