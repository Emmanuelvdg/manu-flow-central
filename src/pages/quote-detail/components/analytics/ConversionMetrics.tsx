
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "../LoadingState";

interface ConversionMetricsProps {
  quoteId: string;
}

export const ConversionMetrics: React.FC<ConversionMetricsProps> = ({ quoteId }) => {
  // Fetch conversion data for this quote
  const { data, isLoading } = useQuery({
    queryKey: ['quote-conversion', quoteId],
    queryFn: async () => {
      // Get the quote details
      const { data: quote } = await supabase
        .from('quotes')
        .select('*, rfqs:rfq_id(*)')
        .eq('id', quoteId)
        .single();
      
      // Check if this quote has been converted to an order
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('quote_id', quoteId)
        .maybeSingle();
      
      return {
        quote,
        hasOrder: !!order,
        orderData: order
      };
    },
  });

  if (isLoading) {
    return <Card><CardContent className="pt-6"><LoadingState message="Loading conversion metrics..." /></CardContent></Card>;
  }

  // Calculate metrics
  const status = data?.quote?.status || "unknown";
  const isConverted = data?.hasOrder || false;
  
  let conversionRate = 0;
  if (status === 'accepted') {
    conversionRate = 100;
  } else if (status === 'rejected') {
    conversionRate = 0;
  } else {
    // For other statuses, we don't know yet
    conversionRate = status === 'submitted' ? 50 : 25; // Just a visual indicator
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Conversion Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isConverted ? "Converted" : "Not Converted"}
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${conversionRate}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </CardContent>
    </Card>
  );
};
