
import { supabase } from "@/integrations/supabase/client";

// Safe date formatting function
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(dateString);
  }
};

// Safe currency formatting function
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '$0';
  try {
    return `$${value.toLocaleString()}`;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `$${String(value)}`;
  }
};

// Quote type definition
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

// Fetch quotes from Supabase
export const fetchQuotes = async (): Promise<Quote[]> => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

// Fetch a single quote by ID
export const fetchQuote = async (quoteId: string): Promise<Quote | null> => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  if (error) {
    console.error("Error fetching quote:", error);
    return null;
  }

  return data;
};
