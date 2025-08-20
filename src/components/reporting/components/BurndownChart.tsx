import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { OrderProcessingData } from "../hooks/useOrderProcessingData";

interface BurndownChartProps {
  data: OrderProcessingData;
}

export const BurndownChart: React.FC<BurndownChartProps> = ({ data }) => {
  // Generate burndown data based on current stage progress
  const generateBurndownData = () => {
    if (!data?.products) return [];

    // Get all unique stages across all products
    const allStages = new Set<string>();
    data.products.forEach(product => {
      product.stageProgress.forEach(stage => {
        allStages.add(stage.stageName);
      });
    });

    const stageNames = Array.from(allStages);
    
    // For demo purposes, generate time-based data points
    // In a real implementation, this would come from historical data
    const timePoints = [];
    const startDate = new Date(data.createdAt);
    const currentDate = new Date();
    const daysDiff = Math.max(1, Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    for (let i = 0; i <= Math.min(daysDiff, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const timePoint: any = {
        day: `Day ${i + 1}`,
        date: date.toISOString().split('T')[0],
        totalRemaining: data.totalItems,
      };

      // Calculate remaining items for each stage
      stageNames.forEach(stageName => {
        const stageTotal = data.products.reduce((sum, product) => {
          const stage = product.stageProgress.find(s => s.stageName === stageName);
          return sum + (stage ? stage.yetToStartUnits + stage.inProgressUnits : 0);
        }, 0);
        timePoint[stageName] = stageTotal;
      });

      // Calculate ideal burndown (linear)
      const progressRate = i / Math.max(daysDiff, 30);
      timePoint.ideal = Math.max(0, data.totalItems * (1 - progressRate));

      timePoints.push(timePoint);
    }

    return timePoints;
  };

  const burndownData = generateBurndownData();
  
  // Get stage names for coloring
  const stageNames = burndownData.length > 0 ? 
    Object.keys(burndownData[0]).filter(key => !['day', 'date', 'totalRemaining', 'ideal'].includes(key)) : [];

  const stageColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'
  ];

  if (!data || burndownData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Multi-Stage Burndown Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available for burndown chart
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Stage Burndown Chart</CardTitle>
        <p className="text-sm text-muted-foreground">
          Remaining work breakdown by production stage with ideal progress line
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={burndownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              
              {/* Stacked bars for remaining work by stage */}
              {stageNames.map((stageName, index) => (
                <Bar
                  key={stageName}
                  dataKey={stageName}
                  stackId="stages"
                  fill={stageColors[index % stageColors.length]}
                />
              ))}
              
              {/* Ideal burndown line */}
              <Line
                type="monotone"
                dataKey="ideal"
                stroke="#ff0000"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Ideal Progress"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend showing current status */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-primary">Total Items</div>
            <div className="text-2xl font-bold">{data.totalItems}</div>
          </div>
          <div>
            <div className="font-medium text-green-600">Completed</div>
            <div className="text-2xl font-bold text-green-600">{data.completedItems}</div>
          </div>
          <div>
            <div className="font-medium text-orange-600">In Progress</div>
            <div className="text-2xl font-bold text-orange-600">
              {data.products.reduce((sum, p) => 
                sum + p.stageProgress.reduce((stageSum, s) => stageSum + s.inProgressUnits, 0), 0
              )}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-600">Not Started</div>
            <div className="text-2xl font-bold text-gray-600">
              {data.products.reduce((sum, p) => 
                sum + p.stageProgress.reduce((stageSum, s) => stageSum + s.yetToStartUnits, 0), 0
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};