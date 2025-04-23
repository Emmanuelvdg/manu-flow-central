
// Utility functions extracted for quote detail logic

export interface RFQProductItem {
  id?: number | string;
  name: string;
  quantity?: number;
}

export function migrateProducts(
  products: any
): RFQProductItem[] | undefined {
  if (products && Array.isArray(products)) {
    return products.map((p: any) => ({
      id: p.id ?? undefined,
      name: p.name ?? String(p),
      quantity: p.quantity ?? 1,
    }));
  }
  return undefined;
}

export function productsToString(products: any): string {
  if (!products) return "";
  if (Array.isArray(products))
    return products.map((prod: any) => prod.name || prod).join(", ");
  return String(products);
}

export function stringToProducts(products: string): RFQProductItem[] {
  return products
    .split(",")
    .map((p) => ({ name: p.trim(), quantity: 1 }))
    .filter((p) => p.name.length > 0);
}
