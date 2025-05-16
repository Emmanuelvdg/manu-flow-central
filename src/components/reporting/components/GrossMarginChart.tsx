
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ProductMarginData } from "../hooks/useFinancialData";
import { AlertCircle, BarChartHorizontal } from "lucide-react";

interface GrossMarginChartProps {
  data: ProductMarginData[];
}

export const GrossMarginChart: React.FC<GrossMarginChartProps> = ({ data }) => {
  // Chart configuration
  const chartConfig = {
    revenue: { theme: { light: "#22c55e", dark: "#22c55e" } },
    cost: { theme: { light: "#ef4444", dark: "#ef4444" } },
    margin: { theme: { light: "#3b82f6", dark: "#3b82f6" } }
  };

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Check if we have any data to display
  const chartData = data.slice(0, 5).map(item => ({
    ...item,
    // Truncate long product names for better display
    productName: item.productName.length > 15 
      ? `${item.productName.substring(0, 12)}...` 
      : item.productName
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center">
          <BarChartHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
          <CardTitle>Top Products by Gross Margin</CardTitle>
        </div>
        <CardDescription>Revenue and margin by product line</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-16 w-16 mb-2 text-muted-foreground/50" />
            <p>No product margin data available</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="productName" 
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    width={50}
                  />
                  <Tooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatCurrency(value), '']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="totalRevenue" 
                    name="Revenue" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="totalCost" 
                    name="Cost" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="totalGrossMargin" 
                    name="Margin" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
