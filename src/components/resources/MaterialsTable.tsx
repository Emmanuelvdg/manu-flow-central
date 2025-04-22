
import React from "react";
import { DataTable, Column, ColumnCellProps } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Material } from "@/types/material";

interface MaterialsTableProps {
  materials: Material[];
  onEditMaterial: (material: Material) => void;
  onCreateOrder: (material: Material) => void;
  formatCurrency: (value: number | null | undefined) => string;
}

export const MaterialsTable: React.FC<MaterialsTableProps> = ({
  materials,
  onEditMaterial,
  onCreateOrder,
  formatCurrency,
}) => {
  const calculateTotalStock = (material: Material): number => {
    return material.batches?.reduce((sum, batch) => sum + (batch.remainingStock || 0), 0) || 0;
  };

  const calculateAverageCost = (material: Material): number => {
    if (!material.batches || material.batches.length === 0) return 0;
    
    const totalCost = material.batches.reduce((sum, batch) => {
      return sum + (batch.costPerUnit || 0) * (batch.initialStock || 0);
    }, 0);
    
    const totalQuantity = material.batches.reduce((sum, batch) => {
      return sum + (batch.initialStock || 0);
    }, 0);
    
    return totalQuantity > 0 ? totalCost / totalQuantity : 0;
  };

  const materialColumns: Column<Material>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        const stock = calculateTotalStock(material);
        return `${stock} ${material.unit}`;
      },
    },
    {
      header: "Average Cost",
      accessorKey: "averageCost",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        const avgCost = calculateAverageCost(material);
        return formatCurrency(avgCost);
      },
    },
    {
      header: "Vendor",
      accessorKey: "vendor",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditMaterial(material)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateOrder(material)}
            >
              Order
            </Button>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={materialColumns} data={materials} />;
};
