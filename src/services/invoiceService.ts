
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Creates an invoice from a completed order
 * @param orderId The ID of the completed order
 * @returns The newly created invoice data or null on error
 */
export const createInvoiceFromOrder = async (orderId: string) => {
  try {
    // Fetch the order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        quotes:quote_id (
          payment_terms,
          customer_email
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error("Order not found");

    // Generate invoice number (e.g., INV-YYYY-XXXX)
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Calculate due date (defaults to 30 days from now if payment terms not specified)
    const paymentTermsDays = order.quotes?.payment_terms ? 
      parseInt(order.quotes.payment_terms.replace(/\D/g, '')) : 
      30;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + paymentTermsDays);

    // Create the invoice record
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        order_id: orderId,
        amount: order.total,
        invoice_number: invoiceNumber,
        due_date: dueDate.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;
    
    return invoice;
  } catch (error) {
    console.error("Error creating invoice from order:", error);
    toast({
      title: "Invoice Creation Error",
      description: error.message || "Failed to create invoice",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Checks if an invoice already exists for a specific order
 * @param orderId The ID of the order to check
 * @returns Boolean indicating if an invoice exists
 */
export const checkInvoiceExistsForOrder = async (orderId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('id')
      .eq('order_id', orderId)
      .maybeSingle();
      
    if (error) throw error;
    return data !== null;
  } catch (error) {
    console.error("Error checking invoice existence:", error);
    return false;
  }
};
