
import { useMemo } from 'react';
import { InvoiceData, InvoiceItem } from '../types';

export const useInvoiceItems = (invoice: InvoiceData | null) => {
  const invoiceItems = useMemo(() => {
    if (!invoice) return [];

    // Calculate invoice items from order products
    return invoice?.order?.products 
      ? Array.isArray(invoice.order.products) 
        ? invoice.order.products.map((product: any, index: number) => ({
            id: index + 1,
            description: product.name || product.product_id || `Product #${index + 1}`,
            quantity: product.quantity || 1,
            unitPrice: product.price || 0,
            total: (product.price || 0) * (product.quantity || 1)
          }))
        : typeof invoice.order.products === 'object' 
          ? Object.values(invoice.order.products).map((product: any, index: number) => ({
              id: index + 1,
              description: product.name || product.product_id || `Product #${index + 1}`,
              quantity: product.quantity || 1,
              unitPrice: product.price || 0,
              total: (product.price || 0) * (product.quantity || 1)
            }))
          : [{
              id: 1,
              description: "Order items",
              quantity: 1,
              unitPrice: invoice.amount,
              total: invoice.amount
            }]
      : [{
          id: 1,
          description: "Order total",
          quantity: 1,
          unitPrice: invoice.amount,
          total: invoice.amount
        }]
  }, [invoice]);

  return invoiceItems;
};
