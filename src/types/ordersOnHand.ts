export interface OrdersOnHandReportRow {
  // Material identification
  materialId: string;
  materialName: string;
  category: string;
  unit: string;
  vendor: string;
  abcClassification: string;
  
  // On Hand (Physical Stock)
  onHandQuantity: number;
  onHandValue: number;
  avgOnHandCost: number;
  
  // On Order (Incoming Stock)
  onOrderQuantity: number;
  onOrderValue: number;
  avgOnOrderCost: number;
  expectedDeliveryDate: string | null;
  
  // Allocated/Reserved
  allocatedQuantity: number;
  allocatedValue: number;
  
  // Available (On Hand - Allocated)
  availableQuantity: number;
  availableValue: number;
  
  // Total (On Hand + On Order)
  totalQuantity: number;
  totalValue: number;
  
  // Metrics
  daysOfSupply: number;
  stockoutRisk: 'low' | 'medium' | 'high';
}

export interface OrdersOnHandSummary {
  totalOnHandValue: number;
  totalOnOrderValue: number;
  totalInventoryValue: number;
  totalAllocatedValue: number;
  totalAvailableValue: number;
  materialCount: number;
  stockoutRiskCount: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface OrdersOnHandFilters {
  search: string;
  category: string;
  vendor: string;
  riskLevel: 'all' | 'low' | 'medium' | 'high';
}
