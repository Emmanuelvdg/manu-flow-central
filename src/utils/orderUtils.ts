
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
  const productInfo = row.products && Array.isArray(row.products) && row.products.length > 0
    ? row.products[0]
    : null;
  
  const totalQuantity = row.products && Array.isArray(row.products) 
    ? row.products.reduce((sum: number, prod: any) => sum + (parseInt(String(prod.quantity)) || 0), 0)
    : 0;
    
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
    products: row.products || []
  };
};
