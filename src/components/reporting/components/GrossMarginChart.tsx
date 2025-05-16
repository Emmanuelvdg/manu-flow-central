
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
  
  // Handle responsive data display - show fewer items on smaller screens
  const getResponsiveData = () => {
    // Determine number of items to show based on available width
    const screenWidth = window.innerWidth;
    let itemCount = 5;
    
    if (screenWidth < 640) {
      itemCount = 3;
    } else if (screenWidth < 768) {
      itemCount = 4;
    }
    
    return data.slice(0, itemCount).map(item => ({
      ...item,
      // Truncate long product names for better display
      productName: item.productName.length > 12 
        ? `${item.productName.substring(0, 10)}...` 
        : item.productName
    }));
  };

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
          <BarChartHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
          <CardTitle>Top Products by Gross Margin</CardTitle>
        </div>
        <CardDescription>Revenue and margin by product line</CardDescription>
      </CardHeader>
      <CardContent className="p-1 sm:p-6">
        {data.length === 0 ? (
          <div className="h-[250px] sm:h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-16 w-16 mb-2 text-muted-foreground/50" />
            <p>No product margin data available</p>
          </div>
        ) : (
          <div className="h-[250px] sm:h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart 
                data={getResponsiveData()}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <XAxis 
                  dataKey="productName" 
                  tick={{ fontSize: 10 }}
                  height={50}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  className="text-xs sm:text-sm"
                />
                <YAxis 
                  tickFormatter={(value) => {
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
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
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
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
