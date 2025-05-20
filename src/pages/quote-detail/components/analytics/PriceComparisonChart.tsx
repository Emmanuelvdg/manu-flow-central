
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LoadingState } from "../LoadingState";
import { useChartDimensions } from "@/hooks/use-chart-dimensions";
import { useIsMobile } from "@/hooks/use-mobile";

interface PriceComparisonChartProps {
  quoteId: string;
}

interface ProductPrice {
  name: string;
  quotePrice: number;
  orderPrice: number;
}

export const PriceComparisonChart: React.FC<PriceComparisonChartProps> = ({ quoteId }) => {
  const [containerRef, dimensions] = useChartDimensions();
  const isMobile = useIsMobile();
  
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
    return <div className="text-center p-4 text-sm">No price comparison data available</div>;
  }

  if (!data.hasOrderData) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <p className="text-muted-foreground text-sm">No order data available for comparison</p>
        <p className="text-xs text-muted-foreground">Quote Total: {data.quoteTotal}</p>
      </div>
    );
  }
  
  // Process data for responsive display
  const prepareChartData = () => {
    // Calculate how many products we can display based on container width
    let maxProducts = data.productsComparison.length;
    
    if (dimensions.width < 350) {
      maxProducts = Math.min(2, data.productsComparison.length);
    } else if (dimensions.width < 450) {
      maxProducts = Math.min(3, data.productsComparison.length);
    } else if (dimensions.width < 768) {
      maxProducts = Math.min(4, data.productsComparison.length);
    }
    
    return data.productsComparison.slice(0, maxProducts).map(product => ({
      ...product,
      name: product.name.length > (isMobile ? 8 : 15)
        ? `${product.name.substring(0, isMobile ? 6 : 13)}...` 
        : product.name
    }));
  };

  const chartConfig = {
    quote: { theme: { light: "#22c55e", dark: "#22c55e" } },
    order: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px] sm:min-h-[250px]">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={dimensions.height || 250}>
          <BarChart 
            data={prepareChartData()}
            margin={{ 
              top: 5, 
              right: isMobile ? 5 : 10, 
              left: isMobile ? -15 : 0, 
              bottom: isMobile ? 15 : 5 
            }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: isMobile ? 8 : 10 }}
              height={isMobile ? 40 : 50}
              angle={isMobile ? -30 : -15}
              textAnchor="end"
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 8 : 10 }}
              width={isMobile ? 35 : 45}
              tickFormatter={(value) => {
                if (dimensions.width < 350) {
                  return `$${Math.round(value / 1000)}k`;
                }
                return `$${(value / 1000).toFixed(0)}k`;
              }}
            />
            <Tooltip 
              content={<ChartTooltipContent />} 
              wrapperStyle={{ zIndex: 1000 }}
            />
            <Legend 
              wrapperStyle={{ fontSize: isMobile ? '8px' : '10px', marginTop: '5px' }} 
              iconSize={isMobile ? 8 : 10}
            />
            <Bar dataKey="quotePrice" name="Quote Price" fill="#22c55e" />
            <Bar dataKey="orderPrice" name="Order Price" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
