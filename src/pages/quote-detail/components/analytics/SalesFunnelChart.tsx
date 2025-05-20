
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LoadingState } from "../LoadingState";
import { useChartDimensions } from "@/hooks/use-chart-dimensions";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalesFunnelChartProps {
  quoteId: string;
}

export const SalesFunnelChart: React.FC<SalesFunnelChartProps> = ({ quoteId }) => {
  const [containerRef, dimensions] = useChartDimensions();
  const isMobile = useIsMobile();
  
  const { data, isLoading } = useQuery({
    queryKey: ['sales-funnel-timeline', quoteId],
    queryFn: async () => {
      // Get the quote with its RFQ and related order
      const { data: quote } = await supabase
        .from('quotes')
        .select(`
          *,
          rfqs:rfq_id(*),
          orders(*)
        `)
        .eq('id', quoteId)
        .single();
      
      if (!quote) return null;
      
      const rfqDate = quote.rfqs?.created_at ? new Date(quote.rfqs.created_at) : null;
      const quoteDate = new Date(quote.created_at);
      const orderDate = quote.orders && quote.orders[0]?.created_at ? 
        new Date(quote.orders[0].created_at) : null;
      
      // Calculate days between stages
      const rfqToQuoteDays = rfqDate ? 
        Math.round((quoteDate.getTime() - rfqDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      const quoteToOrderDays = orderDate ? 
        Math.round((orderDate.getTime() - quoteDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      return {
        rfqDate,
        quoteDate,
        orderDate,
        rfqToQuoteDays,
        quoteToOrderDays,
        totalDays: rfqToQuoteDays + quoteToOrderDays
      };
    }
  });

  if (isLoading) {
    return <LoadingState message="Loading timeline data..." />;
  }

  if (!data) {
    return <div className="text-center p-4 text-sm">No timeline data available</div>;
  }

  // Prepare chart data
  const chartData = [
    {
      name: isMobile ? "RFQ-Quote" : "RFQ to Quote",
      days: data.rfqToQuoteDays,
      fill: "#22c55e" // Green
    }
  ];
  
  if (data.orderDate) {
    chartData.push({
      name: isMobile ? "Quote-Order" : "Quote to Order",
      days: data.quoteToOrderDays,
      fill: "#3b82f6" // Blue
    });
  }

  const chartConfig = {
    green: { theme: { light: "#22c55e", dark: "#22c55e" } },
    blue: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[200px] sm:min-h-[250px]">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={dimensions.height || 250}>
          <BarChart 
            data={chartData} 
            margin={{ 
              top: 5, 
              right: isMobile ? 5 : 20, 
              left: isMobile ? -15 : 0, 
              bottom: 5 
            }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: isMobile ? 10 : 12 }} 
              height={40}
            />
            <YAxis 
              label={{ 
                value: isMobile ? 'Days' : 'Days Elapsed', 
                angle: -90, 
                position: 'insideLeft',
                style: {
                  fontSize: isMobile ? '10px' : '12px',
                  textAnchor: 'middle'
                } 
              }} 
              width={isMobile ? 30 : 40}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <Tooltip 
              content={<ChartTooltipContent />} 
              wrapperStyle={{ zIndex: 1000 }}
            />
            <Bar dataKey="days" name="Days" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
