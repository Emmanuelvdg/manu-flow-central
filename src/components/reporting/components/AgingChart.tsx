
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AgingBucket } from "../hooks/useFinancialData";
import { AlertCircle, BarChart3 } from "lucide-react";

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

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
          <CardTitle>Accounts Receivable Aging</CardTitle>
        </div>
        <CardDescription>Unpaid invoices by age</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-16 w-16 mb-2 text-muted-foreground/50" />
            <p>No invoice aging data available</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    width={50}
                  />
                  <Tooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Amount" 
                    fill="#f59e0b" 
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
