
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AgingBucket } from "../hooks/useFinancialData";

interface AgingChartProps {
  data: AgingBucket[];
}

export const AgingChart: React.FC<AgingChartProps> = ({ data }) => {
  // Chart configuration
  const chartConfig = {
    aging: { theme: { light: "#f59e0b", dark: "#f59e0b" } }
  };
  
  // Check if there's actual data to display
  const hasData = !data.every(bucket => bucket.count === 0);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Accounts Receivable Aging</CardTitle>
        <CardDescription>Unpaid invoices by age</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No invoice aging data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Amount" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
