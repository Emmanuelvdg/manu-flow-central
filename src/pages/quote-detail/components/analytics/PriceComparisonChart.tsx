
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LoadingState } from "../LoadingState";

interface PriceComparisonChartProps {
  quoteId: string;
}

interface ProductPrice {
  name: string;
  quotePrice: number;
  orderPrice: number;
}

export const PriceComparisonChart: React.FC<PriceComparisonChartProps> = ({ quoteId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['price-comparison', quoteId],
    queryFn: async () => {
      // Get the quote with its related order
      const { data: quote } = await supabase
        .from('quotes')
        .select(`
          *,
          orders(*)
        `)
        .eq('id', quoteId)
        .single();
      
      if (!quote) return null;
      
      const quoteTotal = quote.total;
      const orderTotal = quote.orders && quote.orders[0]?.total;
      
      // Create comparison data for each product
      const productsComparison: ProductPrice[] = [];
      if (quote.products && Array.isArray(quote.products)) {
        // Group quote products for comparison
        const quoteProducts: Record<string, ProductPrice> = {};
        
        quote.products.forEach((product: any) => {
          if (product && typeof product === 'object') {
            const name = product.name || 'Unknown Product';
            if (!quoteProducts[name]) {
              quoteProducts[name] = { 
                name, 
                quotePrice: 0,
                orderPrice: 0
              };
            }
            // Sum up prices for products with the same name
            quoteProducts[name].quotePrice += product.price || 0;
          }
        });
        
        // If we have order data, add it to the comparison
        if (quote.orders && quote.orders[0]?.products && Array.isArray(quote.orders[0].products)) {
          quote.orders[0].products.forEach((product: any) => {
            if (product && typeof product === 'object') {
              const name = product.name || 'Unknown Product';
              if (!quoteProducts[name]) {
                quoteProducts[name] = { 
                  name, 
                  quotePrice: 0,
                  orderPrice: 0
                };
              }
              // Sum up prices for products with the same name
              quoteProducts[name].orderPrice += product.price || 0;
            }
          });
        }
        
        // Convert to array for the chart
        Object.values(quoteProducts).forEach(product => {
          productsComparison.push(product);
        });
      }
      
      return {
        quoteTotal,
        orderTotal,
        productsComparison,
        hasOrderData: quote.orders && quote.orders.length > 0
      };
    }
  });

  if (isLoading) {
    return <LoadingState message="Loading price comparison data..." />;
  }

  if (!data) {
    return <div className="text-center p-4">No price comparison data available</div>;
  }

  if (!data.hasOrderData) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <p className="text-muted-foreground">No order data available for comparison</p>
        <p className="text-sm text-muted-foreground">Quote Total: {data.quoteTotal}</p>
      </div>
    );
  }
  
  // Process data for responsive display
  const prepareChartData = () => {
    // For very small screens, limit to fewer products
    const screenWidth = window.innerWidth;
    let maxProducts = data.productsComparison.length;
    
    if (screenWidth < 640) {
      maxProducts = Math.min(3, data.productsComparison.length);
    } else if (screenWidth < 768) {
      maxProducts = Math.min(5, data.productsComparison.length);
    }
    
    return data.productsComparison.slice(0, maxProducts).map(product => ({
      ...product,
      name: product.name.length > 15 
        ? `${product.name.substring(0, 13)}...` 
        : product.name
    }));
  };

  const chartConfig = {
    quote: { theme: { light: "#22c55e", dark: "#22c55e" } },
    order: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
  };

  return (
    <div className="h-[250px] sm:h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <BarChart 
          data={prepareChartData()}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }}
            height={50}
            angle={-15}
            textAnchor="end"
          />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
          <Bar dataKey="quotePrice" name="Quote Price" fill="#22c55e" />
          <Bar dataKey="orderPrice" name="Order Price" fill="#3b82f6" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
