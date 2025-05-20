
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AgingBucket } from "../hooks/useFinancialData";
import { AlertCircle, BarChart3 } from "lucide-react";
import { useChartDimensions } from "@/hooks/use-chart-dimensions";
import { useIsMobile } from "@/hooks/use-mobile";

interface AgingChartProps {
  data: AgingBucket[];
}

export const AgingChart: React.FC<AgingChartProps> = ({ data }) => {
  const [containerRef, dimensions] = useChartDimensions(250);
  const isMobile = useIsMobile();
  
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

  // Format chart data for responsive display
  const getFormattedData = () => {
    if (isMobile) {
      return data.map(bucket => ({
        ...bucket,
        // Shorten names for mobile
        name: bucket.name
          .replace('Current', 'Curr')
          .replace('Due', '')
          .replace('days', 'd')
      }));
    }
    return data;
  };

  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <div className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
          <CardTitle className="text-base sm:text-lg">Accounts Receivable Aging</CardTitle>
        </div>
        <CardDescription className="text-xs sm:text-sm">Unpaid invoices by age</CardDescription>
      </CardHeader>
      <CardContent className="p-1 sm:p-6">
        {!hasData ? (
          <div className="h-[200px] sm:h-[250px] flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 mb-2 text-muted-foreground/50" />
            <p className="text-sm">No invoice aging data available</p>
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full min-h-[200px] sm:min-h-[250px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={dimensions.height || 250}>
                <BarChart 
                  data={getFormattedData()} 
                  margin={{ 
                    top: 5, 
                    right: isMobile ? 5 : 10, 
                    left: isMobile ? -20 : 0, 
                    bottom: isMobile ? 0 : 5 
                  }}
                >
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: isMobile ? 8 : 10 }}
                    tickMargin={isMobile ? 3 : 5}
                    height={isMobile ? 30 : 40}
                    interval="preserveStartEnd"
                    className="text-xs sm:text-sm"
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      // More responsive formatter based on screen size
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
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: isMobile ? '8px' : '10px', marginTop: '5px' }} 
                    iconSize={isMobile ? 8 : 10}
                  />
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
