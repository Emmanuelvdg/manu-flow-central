
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, FileCheck, FileX } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Quote, fetchQuote, createOrderFromQuote } from './quoteUtils';

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

  const acceptQuote = async () => {
    try {
      console.log("Accepting quote:", quoteId);
      
      // Fetch the quote data first
      const quote = await fetchQuote(quoteId);
      if (!quote) {
        throw new Error("Quote not found");
      }
      
      // Create an order from the accepted quote
      const order = await createOrderFromQuote(quote);
      if (!order) {
        throw new Error("Failed to create order from quote");
      }
      
      console.log("Order created successfully:", order);
      
      // Update the quote status to accepted AFTER order creation succeeds
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', quoteId);
      
      if (error) {
        console.error("Error updating quote status:", error);
        throw error;
      }
      
      toast({
        title: "Quote Accepted",
        description: `Quote has been accepted and manufacturing order ${order.order_number} created.`,
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
