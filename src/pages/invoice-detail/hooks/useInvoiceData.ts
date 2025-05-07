
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { InvoiceData } from '../types';

export const useInvoiceData = (invoiceId: string) => {
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchInvoiceDetails = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          order:order_id (
            order_number,
            customer_name,
            shipping_address,
            products,
            quote_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Format the data for the component
      let formattedInvoice: InvoiceData = {...data};
      
      // Get customer email from a separate query if needed
      if (data.order?.quote_id) {
        const { data: quoteData, error: quoteError } = await supabase
          .from('quotes')
          .select('customer_email')
          .eq('id', data.order.quote_id)
          .single();
          
        if (!quoteError && quoteData) {
          formattedInvoice.quote = { customer_email: quoteData.customer_email };
        }
      }
      
      setInvoice(formattedInvoice);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast({
        title: "Error",
        description: "Failed to load invoice details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkAsPaid = async () => {
    if (!invoice) return;
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid: true,
          payment_date: new Date().toISOString()
        })
        .eq('id', invoice.id);
        
      if (error) throw error;
      
      // Update local state
      setInvoice(prev => prev ? {
        ...prev,
        status: 'paid',
        paid: true,
        payment_date: new Date().toISOString()
      } : null);
      
      toast({
        title: "Invoice Updated",
        description: "Invoice has been marked as paid",
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails(invoiceId);
    }
  }, [invoiceId]);

  return {
    invoice,
    loading,
    handleMarkAsPaid
  };
};
