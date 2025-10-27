export interface OrderLogistics {
  id: string;
  order_id: string;
  container_type: '20"' | '40"' | '40HC' | null;
  consol: number | null;
  forecast_load_date: string | null;
  tgl_loading_date: string | null;
  incoterms: string | null;
  qc: string | null;
  pic: string | null;
  notes: string | null;
  port: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderSummaryRow {
  // Order Information
  orderId: string;
  orderNumber: string;
  buyer: string;
  country: string;
  totalOrderValue: number;
  currency: string;
  month: string; // Format: "Oct-25"
  orderDate: Date;
  
  // Payment Information
  amountPaidToDate: number;
  paymentPercentage: number;
  
  // Logistics Information (editable)
  containerType: '20"' | '40"' | '40HC' | null;
  consol: number | null;
  forecastLoadDate: Date | null;
  tglLoadingDate: Date | null;
  incoterms: string | null;
  qc: string | null;
  pic: string | null;
  notes: string | null;
  port: string | null;
  
  // Metadata
  logisticsId: string | null;
}

export interface OrderSummaryFilters {
  startMonth: Date;
  endMonth: Date;
  containerType?: '20"' | '40"' | '40HC';
  buyer?: string;
  country?: string;
}

export interface OrderSummarySummary {
  totalOrders: number;
  totalOrderValue: number;
  totalPaid: number;
  outstandingAmount: number;
  containers: {
    '20"': number;
    '40"': number;
    '40HC': number;
  };
}
