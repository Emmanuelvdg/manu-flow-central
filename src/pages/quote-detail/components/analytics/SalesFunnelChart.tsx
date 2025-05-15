
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LoadingState } from "../LoadingState";

interface SalesFunnelChartProps {
  quoteId: string;
}

export const SalesFunnelChart: React.FC<SalesFunnelChartProps> = ({ quoteId }) => {
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
    return <div className="text-center p-4">No timeline data available</div>;
  }

  // Prepare chart data
  const chartData = [
    {
      name: "RFQ to Quote",
      days: data.rfqToQuoteDays,
      fill: "#22c55e" // Green
    }
  ];
  
  if (data.orderDate) {
    chartData.push({
      name: "Quote to Order",
      days: data.quoteToOrderDays,
      fill: "#3b82f6" // Blue
    });
  }

  const chartConfig = {
    green: { theme: { light: "#22c55e", dark: "#22c55e" } },
    blue: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
  };

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="days" name="Days" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
