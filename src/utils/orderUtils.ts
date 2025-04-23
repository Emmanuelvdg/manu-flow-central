
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
  const productInfo = products.length > 0 ? products[0] : null;
  
  // Calculate total quantity across all products
  const totalQuantity = products.reduce((sum: number, prod: any) => {
    const quantity = prod?.quantity ? parseInt(String(prod.quantity)) : 0;
    return sum + quantity;
  }, 0);
    
  return {
    number: row.order_number || "-",
    groupName: productInfo?.category || "-",
    partNo: productInfo?.id || "-",
    partDescription: productInfo?.name || "-",
    quantity: String(totalQuantity) || "0",
    status: row.status || "-",
    partsStatus: row.parts_status || "-",
    partsStatusColor: getStatusColor(row.parts_status),
    statusColor: getStatusColor(row.status),      
    editable: true,
    checked: false,
    customerName: row.customer_name,
    total: row.total,
    products: products
  };
};
