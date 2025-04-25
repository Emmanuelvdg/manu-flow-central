
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "../types/quoteTypes";

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
