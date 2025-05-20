
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ProductMarginData } from "../hooks/useFinancialData";
import { AlertCircle, BarChartHorizontal } from "lucide-react";
import { useChartDimensions } from "@/hooks/use-chart-dimensions"; 
import { useIsMobile } from "@/hooks/use-mobile";

interface GrossMarginChartProps {
  data: ProductMarginData[];
}

export const GrossMarginChart: React.FC<GrossMarginChartProps> = ({ data }) => {
  const [containerRef, dimensions] = useChartDimensions(250);
  const isMobile = useIsMobile();

  // Chart configuration
  const chartConfig = {
    revenue: { theme: { light: "#22c55e", dark: "#22c55e" } },
    cost: { theme: { light: "#ef4444", dark: "#ef4444" } },
    margin: { theme: { light: "#3b82f6", dark: "#3b82f6" } }
  };
  
  // Handle responsive data display
  const getResponsiveData = () => {
    // Determine number of items to show based on available width
    let itemCount = 5;
    
    if (dimensions.width < 350) {
      itemCount = 2;
    } else if (dimensions.width < 500) {
      itemCount = 3;
    } else if (dimensions.width < 768) {
      itemCount = 4;
    }
    
    return data.slice(0, itemCount).map(item => ({
      ...item,
      // Truncate long product names for better display
      productName: item.productName.length > (isMobile ? 8 : 12) 
        ? `${item.productName.substring(0, isMobile ? 6 : 10)}...` 
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
          <CardTitle className="text-base sm:text-lg">Top Products by Gross Margin</CardTitle>
        </div>
        <CardDescription className="text-xs sm:text-sm">Revenue and margin by product line</CardDescription>
      </CardHeader>
      <CardContent className="p-1 sm:p-6">
        {data.length === 0 ? (
          <div className="h-[200px] sm:h-[250px] flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 mb-2 text-muted-foreground/50" />
            <p className="text-sm">No product margin data available</p>
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full min-h-[200px] sm:min-h-[250px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={dimensions.height || 250}>
                <BarChart 
                  data={getResponsiveData()}
                  margin={{ 
                    top: 5, 
                    right: isMobile ? 5 : 10, 
                    left: isMobile ? -20 : 0, 
                    bottom: isMobile ? 15 : 5 
                  }}
                >
                  <XAxis 
                    dataKey="productName" 
                    tick={{ fontSize: isMobile ? 8 : 10 }}
                    height={isMobile ? 40 : 50}
                    interval={0}
                    angle={isMobile ? -30 : -15}
                    textAnchor="end"
                    className="text-xs sm:text-sm"
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      if (dimensions.width < 350) {
                        return `$${(value / 1000)}k`;
                      }
                      return `$${(value / 1000).toFixed(0)}k`;
                    }}
                    width={isMobile ? 35 : 45}
                    className="text-xs sm:text-sm"
                    tick={{ fontSize: isMobile ? 8 : 10 }}
                  />
                  <Tooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatCurrency(value), '']}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: isMobile ? '8px' : '10px', marginTop: '5px' }} 
                    iconSize={isMobile ? 8 : 10}
                  />
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
