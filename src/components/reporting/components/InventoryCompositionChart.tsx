import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersOnHandReportRow } from "@/types/ordersOnHand";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface InventoryCompositionChartProps {
  data: OrdersOnHandReportRow[];
}

export const InventoryCompositionChart: React.FC<InventoryCompositionChartProps> = ({ data }) => {
  // Group by category and sum values
  const categoryData = data.reduce((acc, row) => {
    const category = row.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = {
        category,
        onHand: 0,
        onOrder: 0,
        allocated: 0,
      };
    }
    acc[category].onHand += row.onHandValue;
    acc[category].onOrder += row.onOrderValue;
    acc[category].allocated += row.allocatedValue;
    return acc;
  }, {} as Record<string, { category: string; onHand: number; onOrder: number; allocated: number }>);

  const chartData = Object.values(categoryData).sort((a, b) => 
    (b.onHand + b.onOrder) - (a.onHand + a.onOrder)
  ).slice(0, 10); // Top 10 categories

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Composition by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            <Legend />
            <Bar dataKey="onHand" fill="hsl(var(--chart-1))" name="On Hand" />
            <Bar dataKey="onOrder" fill="hsl(var(--chart-2))" name="On Order" />
            <Bar dataKey="allocated" fill="hsl(var(--chart-3))" name="Allocated" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
