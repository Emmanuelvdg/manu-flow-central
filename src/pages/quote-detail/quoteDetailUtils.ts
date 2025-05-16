
import type { RFQProductItem } from "./types/quoteTypes";

// Convert older product format to current format
export function migrateProducts(products: any[]): RFQProductItem[] {
  if (!Array.isArray(products)) {
    console.warn("migrateProducts called with non-array:", products);
    return [];
  }
  
  return products.map((product: any) => {
    if (typeof product === 'object' && product !== null) {
      return {
        id: product.id,
        name: product.name || product.product_name || '',
        quantity: product.quantity || 1
      };
    } else {
      return {
        name: String(product),
        quantity: 1
      };
    }
  });
}

export function ensureProductsFormat(products: any): RFQProductItem[] {
  console.log("Ensuring product format for:", products);
  
  if (!products) return [];
  
  if (Array.isArray(products)) {
    return migrateProducts(products);
  }
  
  if (typeof products === 'object') {
    return migrateProducts(Object.values(products));
  }
  
  return [{
    name: String(products),
    quantity: 1
  }];
}
