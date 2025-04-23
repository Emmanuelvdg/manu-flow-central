
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, FileCheck, FileX } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Quote, fetchQuote } from './quoteUtils';

interface QuoteActionsProps {
  quoteId: string;
  status: string;
  onStatusChange: () => void;
}

export const QuoteActions: React.FC<QuoteActionsProps> = ({ 
  quoteId, 
  status, 
  onStatusChange 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const createOrderFromQuote = async (quote: Quote) => {
    const orderNumber = `ORD-${Date.now()}`;
    
    const orderPayload = {
      quote_id: quote.id,
      order_number: orderNumber,
      customer_name: quote.customer_name,
      products: quote.products,
      total: quote.total,
      status: 'created',
      parts_status: 'Not booked'
    };

    const { data, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) throw orderError;
    
    return data.id;
  };

  const acceptQuote = async () => {
    try {
      // Fetch the complete quote data
      const quote = await fetchQuote(quoteId);
      if (!quote) throw new Error("Quote not found");
      
      // Update quote status to accepted
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', quoteId);
      
      if (error) throw error;
      
      // Create manufacturing order based on the quote
      const orderId = await createOrderFromQuote(quote);
      
      toast({
        title: "Quote Accepted",
        description: `Quote has been accepted and manufacturing order created.`,
      });
      
      onStatusChange();
    } catch (error: any) {
      console.error("Error accepting quote:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept quote",
        variant: "destructive",
      });
    }
  };

  const rejectQuote = async () => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'rejected' })
        .eq('id', quoteId);
      
      if (error) throw error;
      
      toast({
        title: "Quote Rejected",
        description: `Quote has been rejected.`,
        variant: "destructive",
      });
      
      onStatusChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject quote",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={(e) => {
        e.stopPropagation();
        navigate(`/quotes/${quoteId}`);
      }}>
        <Eye className="mr-2 h-4 w-4" />
        View
      </Button>
      {status === 'submitted' && (
        <>
          <Button variant="default" size="sm" onClick={(e) => {
            e.stopPropagation();
            acceptQuote();
          }}>
            <FileCheck className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button variant="destructive" size="sm" onClick={(e) => {
            e.stopPropagation();
            rejectQuote();
          }}>
            <FileX className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </>
      )}
    </div>
  );
};
