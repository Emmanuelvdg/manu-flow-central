
import { supabase } from "@/integrations/supabase/client";

export async function fetchRFQs() {
  const { data, error } = await supabase
    .from("rfqs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createRFQ(rfq: Omit<RFQInsert, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("rfqs")
    .insert([rfq])
    .select()
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
