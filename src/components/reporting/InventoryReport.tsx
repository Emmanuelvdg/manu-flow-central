
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LoadingState } from "@/pages/quote-detail/components/LoadingState";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import type { Material } from "@/types/material";

interface InventoryReportProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

interface MaterialWithValues extends Material {
  totalStock: number;
  avgCost: number;
  inventoryValue: number;
  avgLeadTime: number;
  totalAllocated: number;
  percentageOfTotal?: number;
  cumulativePercentage?: number;
  abcClass?: string;
}

interface LeadTimeData {
  name: string;
  leadTime: number;
}

interface AbcChartData {
  name: string;
  value: number;
  count: number;
}

interface InventoryData {
  materials: MaterialWithValues[];
  abcSummary: Record<string, { count: number; value: number }>;
  abcChartData: AbcChartData[];
  leadTimeData: LeadTimeData[];
  totalInventoryValue: number;
}

// ABC classification function
const getAbcClass = (percentage: number): string => {
  if (percentage <= 80) {
    return 'A';
  } else if (percentage <= 95) {
    return 'B';
  } else {
    return 'C';
  }
};

export const InventoryReport: React.FC<InventoryReportProps> = ({ dateRange }) => {
  // Fetch inventory data
  const { data, isLoading } = useQuery({
    queryKey: ['inventory-analysis', dateRange],
    queryFn: async () => {
      // Get materials with their batches
      const { data: materials } = await supabase
        .from('materials')
        .select(`
          *,
          batches:material_batches(*)
        `);
      
      // We would need purchase orders data but the table doesn't exist yet
      // For now, we'll use an empty array as a placeholder
      const purchaseOrders: any[] = [];
      
      // Get material allocations
      const { data: allocations } = await supabase
        .from('material_allocations')
        .select('*');
      
      if (!materials) return null;
      
      // Process materials for ABC analysis
      const materialsWithValues = materials.map(material => {
        // Calculate total value of inventory
        const totalStock = material.batches?.reduce((sum, batch) => sum + (batch.remaining_stock || 0), 0) || 0;
        const avgCost = material.batches?.length > 0
          ? material.batches.reduce((sum, batch) => sum + (batch.cost_per_unit || 0), 0) / material.batches.length
          : 0;
        const inventoryValue = totalStock * avgCost;
        
        // Calculate lead times - since we don't have purchase_orders yet, 
        // we'll use a placeholder approach
        const materialPOs = purchaseOrders.filter(po => po.material_id === material.id) || [];
        const leadTimes: number[] = [];
        
        // Since we don't have purchase orders table yet, we'll skip this logic
        // and set a default avgLeadTime
        const avgLeadTime = 0;
        
        // Material allocations (usage)
        const materialAllocations = allocations?.filter(alloc => alloc.material_id === material.id) || [];
        const totalAllocated = materialAllocations.reduce((sum, alloc) => sum + (alloc.quantity || 0), 0);
        
        // Transform to match our MaterialWithValues interface
        return {
          id: material.id,
          name: material.name,
          category: material.category || "",
          unit: material.unit,
          status: material.status || "Active",
          vendor: material.vendor || "",
          stock: totalStock, // Map totalStock to stock to match the interface
          costPerUnit: avgCost, // Map avgCost to costPerUnit to match the interface
          batches: material.batches || [],
          // Additional calculated values
          totalStock,
          avgCost,
          inventoryValue,
          avgLeadTime,
          totalAllocated
        } as MaterialWithValues;
      });
      
      // Sort by inventory value for ABC analysis
      materialsWithValues.sort((a, b) => b.inventoryValue - a.inventoryValue);
      
      // Calculate total inventory value
      const totalInventoryValue = materialsWithValues.reduce((sum, mat) => sum + mat.inventoryValue, 0);
      
      // Assign ABC classes
      let cumulativePercentage = 0;
      const materialsWithABC = materialsWithValues.map(material => {
        const percentageOfTotal = (material.inventoryValue / totalInventoryValue) * 100;
        cumulativePercentage += percentageOfTotal;
        const abcClass = getAbcClass(cumulativePercentage);
        
        return {
          ...material,
          percentageOfTotal,
          cumulativePercentage,
          abcClass
        };
      });
      
      // Group by ABC class
      const abcSummary = {
        A: { count: 0, value: 0 },
        B: { count: 0, value: 0 },
        C: { count: 0, value: 0 }
      };
      
      materialsWithABC.forEach(material => {
        if (material.abcClass) {
          abcSummary[material.abcClass].count++;
          abcSummary[material.abcClass].value += material.inventoryValue;
        }
      });
      
      // Create summary data for charts
      const abcChartData = [
        { name: 'Class A', value: abcSummary.A.value, count: abcSummary.A.count },
        { name: 'Class B', value: abcSummary.B.value, count: abcSummary.B.count },
        { name: 'Class C', value: abcSummary.C.value, count: abcSummary.C.count }
      ];
      
      // Lead time analysis - since we don't have purchase orders yet, 
      // we'll create mock data based on materials
      const leadTimeData = materialsWithABC
        .slice(0, 10)
        .map(m => ({
          name: m.name,
          leadTime: Math.random() * 30 // Mock data for lead time until we have real data
        }));
      
      return {
        materials: materialsWithABC,
        abcSummary,
        abcChartData,
        leadTimeData,
        totalInventoryValue
      } as InventoryData;
    }
  });
  
  if (isLoading) {
    return <LoadingState message="Loading inventory analysis..." />;
  }
  
  if (!data) {
    return <div className="text-center p-4">No inventory data available</div>;
  }
  
  const { materials, abcChartData, leadTimeData, totalInventoryValue } = data;
  
  // ABC table columns
  const abcColumns: Column<any>[] = [
    {
      header: "Material",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Total Stock",
      accessorKey: "totalStock",
      cell: (props) => props.getValue().toFixed(2)
    },
    {
      header: "Avg. Cost",
      accessorKey: "avgCost",
      cell: (props) => `$${props.getValue().toFixed(2)}`
    },
    {
      header: "Value",
      accessorKey: "inventoryValue",
      cell: (props) => `$${props.getValue().toFixed(2)}`
    },
    {
      header: "% of Total",
      accessorKey: "percentageOfTotal",
      cell: (props) => `${props.getValue().toFixed(1)}%`
    },
    {
      header: "ABC Class",
      accessorKey: "abcClass",
      cell: (props) => {
        const abcClass = props.getValue();
        let bgColor = 'bg-gray-100';
        if (abcClass === 'A') bgColor = 'bg-green-100 text-green-800';
        if (abcClass === 'B') bgColor = 'bg-blue-100 text-blue-800';
        if (abcClass === 'C') bgColor = 'bg-orange-100 text-orange-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
            {abcClass}
          </span>
        );
      }
    }
  ];
  
  // Chart configuration
  const chartConfig = {
    classA: { theme: { light: "#22c55e", dark: "#22c55e" } },
    classB: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
    classC: { theme: { light: "#f59e0b", dark: "#f59e0b" } },
    leadTime: { theme: { light: "#8b5cf6", dark: "#8b5cf6" } }
  };
  
  // Pie chart colors
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Inventory Analysis</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Class A Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{abcChartData[0].count}</div>
            <p className="text-xs text-muted-foreground">
              {(abcChartData[0].value / totalInventoryValue * 100).toFixed(1)}% of total value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Class B Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{abcChartData[1].count}</div>
            <p className="text-xs text-muted-foreground">
              {(abcChartData[1].value / totalInventoryValue * 100).toFixed(1)}% of total value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Class C Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{abcChartData[2].count}</div>
            <p className="text-xs text-muted-foreground">
              {(abcChartData[2].value / totalInventoryValue * 100).toFixed(1)}% of total value
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>ABC Classification</CardTitle>
            <CardDescription>Inventory value distribution by ABC class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={abcChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {abcChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Supplier Lead Times</CardTitle>
            <CardDescription>Average lead times for top 10 materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadTimeData}>
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="leadTime" name="Lead Time (Days)" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>ABC Inventory Classification</CardTitle>
          <CardDescription>Materials categorized by value contribution</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={abcColumns}
            data={materials}
          />
        </CardContent>
      </Card>
    </div>
  );
};
