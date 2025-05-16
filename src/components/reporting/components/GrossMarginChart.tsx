
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ProductMarginData } from "../hooks/useFinancialData";

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

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Top Products by Gross Margin</CardTitle>
        <CardDescription>Revenue and margin by product line</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No product margin data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.slice(0, 5)}>
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="totalRevenue" name="Revenue" fill="#22c55e" />
                  <Bar dataKey="totalCost" name="Cost" fill="#ef4444" />
                  <Bar dataKey="totalGrossMargin" name="Margin" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
