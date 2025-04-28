
import { supabase } from "@/integrations/supabase/client";

export async function fetchRFQs() {
  const { data, error } = await supabase
    .from("rfqs")
    .select(`
      *,
      quotes:quotes(id)
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createRFQ(rfq: Omit<RFQInsert, "id" | "created_at" | "updated_at">) {
  // Ensure customer_name is not empty
  if (!rfq.customer_name || rfq.customer_name.trim() === '') {
    throw new Error('Customer name is required');
  }
  
  // Ensure products array exists
  if (!rfq.products || !Array.isArray(rfq.products) || rfq.products.length === 0) {
    throw new Error('At least one product is required');
  }
  
  const { data, error } = await supabase
    .from("rfqs")
    .insert([rfq])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchRFQById(id: string) {
  const { data, error } = await supabase
    .from("rfqs")
    .select(`
      *,
      quotes:quotes(*)
    `)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Type for inserting a new RFQ
export interface RFQInsert {
  rfq_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  company_name?: string;
  location?: string;
  products: any;
  status?: string;
  notes?: string;
}
