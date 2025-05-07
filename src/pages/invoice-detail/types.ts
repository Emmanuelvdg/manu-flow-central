
export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  id: string;
  order_id: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  paid: boolean;
  payment_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  order?: {
    order_number: string;
    customer_name: string;
    shipping_address: string;
    products: any;
    quote_id: string;
  };
  quote?: {
    customer_email: string;
  };
}
