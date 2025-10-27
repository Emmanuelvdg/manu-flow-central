import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersOnHandSummary } from "@/types/ordersOnHand";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StockRiskChartProps {
  summary: OrdersOnHandSummary;
}

export const StockRiskChart: React.FC<StockRiskChartProps> = ({ summary }) => {
  const data = [
    { name: "Low Risk", value: summary.stockoutRiskCount.low, color: "hsl(var(--chart-1))" },
    { name: "Medium Risk", value: summary.stockoutRiskCount.medium, color: "hsl(var(--chart-3))" },
    { name: "High Risk", value: summary.stockoutRiskCount.high, color: "hsl(var(--chart-5))" },
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
