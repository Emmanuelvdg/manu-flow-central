
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/DataTable"; 

export const QuoteOrderMapping: React.FC = () => {
  const { data: mappings = [], isLoading, error } = useQuery({
    queryKey: ['quote-order-mappings'],
    queryFn: async () => {
      // First get all accepted quotes
      const { data: acceptedQuotes, error: quotesError } = await supabase
        .from("quotes")
        .select("id, quote_number, status, customer_name, total")
        .eq("status", "accepted");
        
      if (quotesError) throw quotesError;
      
      if (!acceptedQuotes || acceptedQuotes.length === 0) {
        return [];
      }
      
      // Get related orders for these quotes
      const quoteIds = acceptedQuotes.map(quote => quote.id);
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, order_number, quote_id, total")
        .in("quote_id", quoteIds);
        
      if (ordersError) throw ordersError;
      
      // Combine the data
      return acceptedQuotes.map(quote => {
        const relatedOrder = orders?.find(order => order.quote_id === quote.id);
        return {
          quoteId: quote.id,
          quoteNumber: quote.quote_number,
          customer: quote.customer_name,
          quoteTotal: quote.total,
          orderId: relatedOrder?.id || null,
          orderNumber: relatedOrder?.order_number || "No order found",
          orderTotal: relatedOrder?.total || 0,
          priceDifference: relatedOrder ? relatedOrder.total - quote.total : 0
        };
      });
    }
  });
  
  const columns: Column<typeof mappings[0]>[] = [
    {
      header: "Quote Number",
      accessorKey: "quoteNumber"
    },
    {
      header: "Customer",
      accessorKey: "customer"
    },
    {
      header: "Quote Total",
      accessorKey: "quoteTotal",
      cell: (props) => `$${props.getValue().toFixed(2)}`
    },
    {
      header: "Order Number",
      accessorKey: "orderNumber"
    },
    {
      header: "Order Total",
      accessorKey: "orderTotal",
      cell: (props) => `$${props.getValue().toFixed(2)}`
    },
    {
      header: "Price Difference",
      accessorKey: "priceDifference",
      cell: (props) => {
        const value = props.getValue() as number;
        const color = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
        return <span className={color}>${Math.abs(value).toFixed(2)}{value > 0 ? ' (+)' : value < 0 ? ' (-)' : ''}</span>;
      }
    }
  ];

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
          <DataTable
            columns={columns}
            data={mappings}
          />
        )}
      </CardContent>
    </Card>
  );
};
