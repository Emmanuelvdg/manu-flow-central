
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import type { ProductMarginData } from "../hooks/useFinancialData";

interface ProductMarginTableProps {
  data: ProductMarginData[];
}

export const ProductMarginTable: React.FC<ProductMarginTableProps> = ({ data }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Gross Margin Analysis</CardTitle>
        <CardDescription>Financial breakdown by product line</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No product margin data available for the selected time period
          </div>
        ) : (
          <DataTable
            columns={marginColumns}
            data={data}
          />
        )}
      </CardContent>
    </Card>
  );
};
