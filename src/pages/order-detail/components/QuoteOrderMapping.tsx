
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const QuoteOrderMapping: React.FC = () => {
  const { data: mappings = [], isLoading, error } = useQuery({
    queryKey: ['quote-order-mappings'],
    queryFn: async () => {
      // First get all accepted quotes
      const { data: acceptedQuotes, error: quotesError } = await supabase
        .from("quotes")
        .select("id, quote_number, status")
        .eq("status", "accepted");
        
      if (quotesError) throw quotesError;
      
      if (!acceptedQuotes || acceptedQuotes.length === 0) {
        return [];
      }
      
      // Get related orders for these quotes
      const quoteIds = acceptedQuotes.map(quote => quote.id);
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, order_number, quote_id")
        .in("quote_id", quoteIds);
        
      if (ordersError) throw ordersError;
      
      // Combine the data
      return acceptedQuotes.map(quote => {
        const relatedOrder = orders?.find(order => order.quote_id === quote.id);
        return {
          quoteId: quote.id,
          quoteNumber: quote.quote_number,
          orderId: relatedOrder?.id || null,
          orderNumber: relatedOrder?.order_number || "No order found",
        };
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote to Order Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-center py-4">Loading mappings...</div>}
        {error && (
          <div className="text-red-500 py-4">
            Error loading mappings: {error.toString()}
          </div>
        )}
        {!isLoading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Quote Number</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No accepted quotes found. Try accepting a quote first.
                  </TableCell>
                </TableRow>
              ) : (
                mappings.map((mapping) => (
                  <TableRow key={mapping.quoteId}>
                    <TableCell className="font-mono text-xs">{mapping.quoteId}</TableCell>
                    <TableCell>{mapping.quoteNumber}</TableCell>
                    <TableCell className="font-mono text-xs">{mapping.orderId || "—"}</TableCell>
                    <TableCell>{mapping.orderNumber}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
