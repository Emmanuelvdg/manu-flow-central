
export interface Quote {
  id: string;
  rfq_id?: string;
  customer_name: string;
  customer_email?: string;
  company_name?: string;
  created_at: string;
  products: any; // Accept JSON from Supabase
  status: string;
  total: number;
  payment_terms?: string;
  incoterms?: string;
  currency?: string;
  shipping_method?: string;
  estimated_delivery?: string;
  risk_level?: string;
  deposit_percentage?: number;
  quote_number: string;
}
