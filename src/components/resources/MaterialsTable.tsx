
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
        const stock = material.stock || 0;
        return `${stock} ${material.unit}`;
      },
    },
    {
      header: "Average Cost",
      accessorKey: "costPerUnit",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        return formatCurrency(material.costPerUnit);
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
