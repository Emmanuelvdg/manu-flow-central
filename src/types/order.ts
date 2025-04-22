
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
}

export interface ColumnHeader {
  key: string;
  label: string;
  className?: string;
}
