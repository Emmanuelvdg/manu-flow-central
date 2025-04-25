
import React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMaterialAllocations } from "./hooks/useMaterialAllocations";
import { useMaterials } from "./hooks/useMaterials";
import { Badge } from "@/components/ui/badge";

export const MaterialStockReport = () => {
  const { data: allocations = [] } = useMaterialAllocations();
  const { materials } = useMaterials();

  const reportData = allocations.map(allocation => {
    const material = materials.find(m => m.id === allocation.material_id);
    return {
      ...allocation,
      materialName: material?.name || 'Unknown',
      materialUnit: material?.unit || '-',
      // Add stock information for better context
      totalStock: material?.stock || 0
    };
  });

  // Sort by material name and then by order_id for better organization
  const sortedReportData = [...reportData].sort((a, b) => {
    if (a.materialName !== b.materialName) {
      return a.materialName.localeCompare(b.materialName);
    }
    return a.order_id.localeCompare(b.order_id);
  });

  const columns = [
    {
      header: "Material",
      accessorKey: "materialName",
    },
    {
      header: "Order ID",
      accessorKey: "order_id",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      cell: ({ getValue, row }: any) => (
        <span>{getValue()} {row.original.materialUnit}</span>
      ),
    },
    {
      header: "Type",
      accessorKey: "allocation_type",
      cell: ({ getValue }: any) => {
        const value = getValue();
        return (
          <Badge variant={
            value === 'booked' ? 'default' :
            value === 'requested' ? 'secondary' :
            'outline'
          }>
            {value}
          </Badge>
        );
      },
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Stock Allocations by Order</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={sortedReportData}
        />
      </CardContent>
    </Card>
  );
};
