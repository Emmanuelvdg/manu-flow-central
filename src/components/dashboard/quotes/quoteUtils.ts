
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
  created_at: string;
  products: any; // Accept JSON from Supabase
  status: string;
  total: number;
  payment_terms?: string;
  incoterms?: string;
  estimated_delivery?: string;
  risk_level?: string;
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
