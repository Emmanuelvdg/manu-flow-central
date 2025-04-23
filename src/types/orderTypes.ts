
export interface ProductData {
  id?: string;
  name?: string;
  quantity?: string | number;
  unit?: string;
  category?: string;
}

export interface OrderStatusConfig {
  color: string;
  label: string;
}

export interface OrderFilters {
  search: string;
  quantityRange: {
    min: string;
    max: string;
  };
  statusFilter: string;
  partsStatusFilter: string;
}
