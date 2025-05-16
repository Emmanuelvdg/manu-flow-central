
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
    <Card className="col-span-1 h-full">
      <CardHeader>
        <div className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
          <CardTitle>Accounts Receivable Aging</CardTitle>
        </div>
        <CardDescription>Unpaid invoices by age</CardDescription>
      </CardHeader>
      <CardContent className="p-1 sm:p-6">
        {!hasData ? (
          <div className="h-[250px] sm:h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-16 w-16 mb-2 text-muted-foreground/50" />
            <p>No invoice aging data available</p>
          </div>
        ) : (
          <div className="h-[250px] sm:h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  tickMargin={5}
                  height={40}
                  interval="preserveStartEnd"
                  className="text-xs sm:text-sm"
                />
                <YAxis 
                  tickFormatter={(value) => {
                    // Responsive formatter based on screen size
                    if (window.innerWidth < 640) {
                      return `$${(value / 1000)}k`;
                    }
                    return `$${(value / 1000).toFixed(0)}k`;
                  }}
                  width={45}
                  className="text-xs sm:text-sm"
                />
                <Tooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                />
                <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                <Bar 
                  dataKey="value" 
                  name="Amount" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
