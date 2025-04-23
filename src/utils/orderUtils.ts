
import { Order } from "@/types/order";
import { ProductData } from "@/types/orderTypes";

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'processing':
    case 'created':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-orange-100 text-orange-800';
    default:
      return '';
  }
};

export const parseOrderRow = (row: any): Order => {
  // Ensure we have valid data to work with
  if (!row) return {} as Order;
  
  console.log("Parsing order row:", row);
  
  // Fix for missing or empty products array
  const products = Array.isArray(row.products) ? row.products : [];
  
  // Find the first product with the most info
  const productInfo = products.length > 0 
    ? products.reduce((best: any, current: any) => {
        // Prefer products with more defined information
        const bestScore = (best?.category ? 1 : 0) + (best?.id ? 1 : 0) + (best?.name ? 1 : 0);
        const currentScore = (current?.category ? 1 : 0) + (current?.id ? 1 : 0) + (current?.name ? 1 : 0);
        return currentScore > bestScore ? current : best;
      }, products[0])
    : null;
    
  // Also check if we have quote data with products
  let quoteProducts = [];
  if (row.quotes && row.quotes.products && Array.isArray(row.quotes.products)) {
    quoteProducts = row.quotes.products;
    console.log("Found products in quote data:", quoteProducts);
  }
  
  // Use quote products as fallback if order products are empty
  const effectiveProducts = products.length > 0 ? products : quoteProducts;
  
  // Find the best product info from any available source
  const effectiveProductInfo = productInfo || 
    (effectiveProducts.length > 0 ? effectiveProducts[0] : null);
  
  // Calculate total quantity across all products
  const totalQuantity = effectiveProducts.reduce((sum: number, prod: any) => {
    const quantity = prod?.quantity ? parseInt(String(prod.quantity)) : 0;
    return sum + quantity;
  }, 0);
    
  return {
    number: row.order_number || "-",
    groupName: effectiveProductInfo?.category || "-",
    partNo: effectiveProductInfo?.id || "-",
    partDescription: effectiveProductInfo?.name || "-",
    quantity: String(totalQuantity) || "0",
    status: row.status || "-",
    partsStatus: row.parts_status || "-",
    partsStatusColor: getStatusColor(row.parts_status),
    statusColor: getStatusColor(row.status),      
    editable: true,
    checked: false,
    customerName: row.customer_name || (row.quotes ? row.quotes.customer_name : null),
    total: row.total,
    products: effectiveProducts
  };
};
