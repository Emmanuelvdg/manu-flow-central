
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { LoadingState } from "@/pages/quote-detail/components/LoadingState";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";

interface FinancialReportProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

interface ProductMarginData {
  productId: string;
  productName: string;
  orderCount: number;
  totalRevenue: number;
  totalCost: number;
  totalGrossMargin: number;
  averageGrossMarginPercentage: number;
}

interface AgingBucket {
  name: string;
  count: number;
  value: number;
}

interface FinancialData {
  grossMarginByProduct: ProductMarginData[];
  agingData: AgingBucket[];
  wipTotal: number;
  totalOrders: number;
  totalRevenue: number;
  invoicesPaid: number;
  invoicesUnpaid: number;
}

export const FinancialReport: React.FC<FinancialReportProps> = ({ dateRange }) => {
  // Calculate date range for filtering
  const calculateDateRange = () => {
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return startDate.toISOString();
  };

  const startDate = calculateDateRange();
  
  // Fetch financial data
  const { data, isLoading } = useQuery({
    queryKey: ['financial-analysis', dateRange],
    queryFn: async () => {
      // Get orders in date range
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          order_products(*)
        `)
        .gte('created_at', startDate);
      
      // Get invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .gte('created_at', startDate);
      
      // Get recipes for cost data
      const { data: recipes } = await supabase
        .from('recipes')
        .select('*');
      
      if (!orders) return null;
      
      // Product lines with gross margin
      const productGroups: Record<string, ProductMarginData> = {};
      
      orders.forEach(order => {
        if (order.order_products && order.order_products.length > 0) {
          order.order_products.forEach(product => {
            const productId = product.product_id;
            const recipeId = product.recipe_id;
            
            // Find matching recipe for cost data
            const recipe = recipes?.find(r => r.id === recipeId);
            const productCost = recipe ? recipe.totalCost : 0;
            
            // Calculate revenue (using order total as approximation)
            const revenue = order.total || 0;
            const costOfSales = productCost || 0;
            const grossMargin = revenue - costOfSales;
            const grossMarginPercentage = revenue > 0 ? (grossMargin / revenue) * 100 : 0;
            
            // Group by product ID
            if (!productGroups[productId]) {
              productGroups[productId] = {
                productId,
                productName: product.product_id,
                orderCount: 0,
                totalRevenue: 0,
                totalCost: 0,
                totalGrossMargin: 0,
                averageGrossMarginPercentage: 0
              };
            }
            
            productGroups[productId].orderCount++;
            productGroups[productId].totalRevenue += revenue;
            productGroups[productId].totalCost += costOfSales;
            productGroups[productId].totalGrossMargin += grossMargin;
          });
        }
      });
      
      // Calculate averages
      Object.values(productGroups).forEach(group => {
        group.averageGrossMarginPercentage = 
          group.totalRevenue > 0 ? (group.totalGrossMargin / group.totalRevenue) * 100 : 0;
      });
      
      // Convert to array and sort by margin
      const grossMarginByProduct = Object.values(productGroups)
        .sort((a, b) => b.totalGrossMargin - a.totalGrossMargin);
      
      // Invoice aging analysis
      const agingBuckets: Record<string, AgingBucket> = {
        'current': { name: 'Current', count: 0, value: 0 },
        '1-30': { name: '1-30 Days', count: 0, value: 0 },
        '31-60': { name: '31-60 Days', count: 0, value: 0 },
        '61-90': { name: '61-90 Days', count: 0, value: 0 },
        '90+': { name: 'Over 90 Days', count: 0, value: 0 }
      };
      
      if (invoices) {
        const now = new Date();
        
        invoices.forEach(invoice => {
          if (!invoice.paid && invoice.due_date) {
            const dueDate = new Date(invoice.due_date);
            const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
            
            let bucket;
            if (daysDiff <= 0) {
              bucket = 'current';
            } else if (daysDiff <= 30) {
              bucket = '1-30';
            } else if (daysDiff <= 60) {
              bucket = '31-60';
            } else if (daysDiff <= 90) {
              bucket = '61-90';
            } else {
              bucket = '90+';
            }
            
            agingBuckets[bucket].count++;
            agingBuckets[bucket].value += invoice.amount || 0;
          }
        });
      }
      
      // Convert to array for chart
      const agingData = Object.values(agingBuckets);
      
      // WIP Valuation
      const wipTotal = orders
        .filter(order => ['in_progress', 'processing'].includes(order.status))
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      return {
        grossMarginByProduct,
        agingData,
        wipTotal,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        invoicesPaid: invoices?.filter(inv => inv.paid).length || 0,
        invoicesUnpaid: invoices?.filter(inv => !inv.paid).length || 0
      } as FinancialData;
    }
  });

  if (isLoading) {
    return <LoadingState message="Loading financial analysis..." />;
  }

  if (!data) {
    return <div className="text-center p-4">No financial data available</div>;
  }
  
  const { grossMarginByProduct, agingData, wipTotal, totalOrders, totalRevenue, invoicesPaid, invoicesUnpaid } = data;
  
  // Gross margin columns
  const marginColumns: Column<any>[] = [
    {
      header: "Product",
      accessorKey: "productName",
    },
    {
      header: "Orders",
      accessorKey: "orderCount",
    },
    {
      header: "Revenue",
      accessorKey: "totalRevenue",
      cell: (props) => `$${props.getValue().toFixed(2)}`
    },
    {
      header: "Cost",
      accessorKey: "totalCost",
      cell: (props) => `$${props.getValue().toFixed(2)}`
    },
    {
      header: "Gross Margin",
      accessorKey: "totalGrossMargin",
      cell: (props) => `$${props.getValue().toFixed(2)}`
    },
    {
      header: "Margin %",
      accessorKey: "averageGrossMarginPercentage",
      cell: (props) => {
        const value = props.getValue();
        const color = value >= 30 ? 'text-green-600' : value >= 15 ? 'text-amber-600' : 'text-red-600';
        return <span className={color}>{value.toFixed(1)}%</span>;
      }
    }
  ];
  
  // Chart configuration
  const chartConfig = {
    revenue: { theme: { light: "#22c55e", dark: "#22c55e" } },
    cost: { theme: { light: "#ef4444", dark: "#ef4444" } },
    margin: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
    aging: { theme: { light: "#f59e0b", dark: "#f59e0b" } }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Financial Performance</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">WIP Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wipTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invoices (Paid/Unpaid)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoicesPaid}/{invoicesUnpaid}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Products by Gross Margin</CardTitle>
            <CardDescription>Revenue and margin by product line</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={grossMarginByProduct.slice(0, 5)}>
                    <XAxis dataKey="productName" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="totalRevenue" name="Revenue" fill="#22c55e" />
                    <Bar dataKey="totalCost" name="Cost" fill="#ef4444" />
                    <Bar dataKey="totalGrossMargin" name="Margin" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Accounts Receivable Aging</CardTitle>
            <CardDescription>Unpaid invoices by age</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agingData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Amount" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Gross Margin Analysis</CardTitle>
          <CardDescription>Financial breakdown by product line</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={marginColumns}
            data={grossMarginByProduct}
          />
        </CardContent>
      </Card>
    </div>
  );
};
