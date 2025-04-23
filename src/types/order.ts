
export interface Order {
  number: string;
  groupName: string;
  partNo: string;
  partDescription: string;
  quantity: string;
  status: string;
  partsStatus: string;
  partsStatusColor: string;
  statusColor: string;
  editable: boolean;
  checked: boolean;
  // Added fields to match with quote data
  customerName?: string;
  total?: number;
  products?: any[];
}

export interface ColumnHeader {
  key: string;
  label: string;
  className?: string;
}
