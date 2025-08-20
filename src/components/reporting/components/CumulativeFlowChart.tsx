import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OrderProcessingData } from "../hooks/useOrderProcessingData";

interface CumulativeFlowChartProps {
  data: OrderProcessingData;
}

export const CumulativeFlowChart: React.FC<CumulativeFlowChartProps> = ({ data }) => {
  // Generate cumulative flow data
  const generateCFDData = () => {
    if (!data?.products) return [];

    // Get all unique stages and sort them by typical workflow order
    const stageOrder = ['Not Started', 'Wood Cutting', 'Sanding', 'Assembly', 'Finishing', 'Quality Check', 'Shipping'];
    const allStages = new Set<string>();
    
    data.products.forEach(product => {
      product.stageProgress.forEach(stage => {
        allStages.add(stage.stageName);
      });
    });

    // Add "Not Started" and "Completed" as special stages
    allStages.add('Not Started');
    allStages.add('Completed');

    // Sort stages based on typical workflow order
    const sortedStages = Array.from(allStages).sort((a, b) => {
      const aIndex = stageOrder.indexOf(a);
      const bIndex = stageOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    // Generate time points (for demo, using current state over time)
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
      };

      let cumulativeSum = 0;

      // Calculate cumulative values for each stage
      sortedStages.forEach(stageName => {
        let stageCount = 0;
        
        if (stageName === 'Not Started') {
          stageCount = data.products.reduce((sum, product) => {
            return sum + product.stageProgress.reduce((stageSum, s) => stageSum + s.yetToStartUnits, 0);
          }, 0);
        } else if (stageName === 'Completed') {
          stageCount = data.products.reduce((sum, product) => {
            return sum + product.stageProgress.reduce((stageSum, s) => stageSum + s.completedUnits, 0);
          }, 0);
        } else {
          stageCount = data.products.reduce((sum, product) => {
            const stage = product.stageProgress.find(s => s.stageName === stageName);
            return sum + (stage ? stage.inProgressUnits : 0);
          }, 0);
        }

        cumulativeSum += stageCount;
        timePoint[stageName] = cumulativeSum;
      });

      timePoints.push(timePoint);
    }

    return timePoints;
  };

  const cfdData = generateCFDData();
  
  // Get stage names for coloring (in reverse order for stacking)
  const stageNames = cfdData.length > 0 ? 
    Object.keys(cfdData[0]).filter(key => !['day', 'date'].includes(key)).reverse() : [];

  const stageColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042',
    '#a4de6c', '#d084d0', '#ffab91', '#81c784'
  ];

  if (!data || !data.products.length || cfdData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Flow Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            {!data ? "No order data available" : 
             !data.products.length ? "No products found for this order" :
             "No stage progress data available for cumulative flow diagram"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Flow Diagram</CardTitle>
        <p className="text-sm text-muted-foreground">
          Work in progress across all production stages over time
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cfdData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  // Calculate the actual value for this band (not cumulative)
                  const currentIndex = stageNames.indexOf(name as string);
                  const prevStageName = stageNames[currentIndex + 1];
                  const prevValue = prevStageName ? (props.payload as any)[prevStageName] || 0 : 0;
                  const actualValue = (value as number) - prevValue;
                  return [actualValue, name];
                }}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              
              {/* Stacked areas for each stage */}
              {stageNames.map((stageName, index) => (
                <Area
                  key={stageName}
                  type="monotone"
                  dataKey={stageName}
                  stackId="1"
                  fill={stageColors[index % stageColors.length]}
                  stroke={stageColors[index % stageColors.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Current WIP summary */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Work in Progress</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {stageNames.reverse().map((stageName, index) => {
              let currentCount = 0;
              
              if (stageName === 'Not Started') {
                currentCount = data.products.reduce((sum, product) => {
                  return sum + product.stageProgress.reduce((stageSum, s) => stageSum + s.yetToStartUnits, 0);
                }, 0);
              } else if (stageName === 'Completed') {
                currentCount = data.products.reduce((sum, product) => {
                  return sum + product.stageProgress.reduce((stageSum, s) => stageSum + s.completedUnits, 0);
                }, 0);
              } else {
                currentCount = data.products.reduce((sum, product) => {
                  const stage = product.stageProgress.find(s => s.stageName === stageName);
                  return sum + (stage ? stage.inProgressUnits : 0);
                }, 0);
              }

              return (
                <div key={stageName} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: stageColors[index % stageColors.length] }}
                  />
                  <span className="text-xs">{stageName}: {currentCount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};