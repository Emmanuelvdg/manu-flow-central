import { Json } from "@/integrations/supabase/types";
import { VariantType } from "../types/product";

/**
 * Safely parse JSON fields from database
 * @param jsonData The JSON data from database
 * @returns The parsed data or default value
 */
export function parseJsonField(jsonData: Json | null): any {
  if (!jsonData) {
    return null;
  }
  
  // If it's already an object, return it
  if (typeof jsonData !== 'string') {
    return jsonData;
  }
  
  try {
    return JSON.parse(jsonData);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return null;
  }
}

/**
 * Create a default product variant object
 */
export function createDefaultVariant(sku: string, price: number, attributes: Record<string, string>) {
  return {
    id: `variant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    sku,
    attributes,
    price,
    product_id: '', // Will be filled when saving
  };
}

export function formatVariantAttributes(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .map(([_, value]) => `${value}`)
    .join(', ');
}
