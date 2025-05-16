import React from "react";
import { DataTable, Column, ColumnCellProps } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Material } from "@/types/material";
import { useMaterialAllocations, calculateAvailableStock } from "./hooks/useMaterialAllocations";
import { Badge } from "@/components/ui/badge";

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
  const { data: allocations = [] } = useMaterialAllocations();

  // Ensure materials is always an array
  const materialsList = Array.isArray(materials) ? materials : [];

  const materialColumns: Column<Material>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        return (material.category && material.category.trim() !== '') ? material.category : "-";
      },
    },
    {
      header: "ABC Class",
      accessorKey: "abcClassification",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        const classification = material.abcClassification || 'C';
        
        let badgeVariant = "outline";
        if (classification === 'A') badgeVariant = "destructive";
        else if (classification === 'B') badgeVariant = "secondary";
        
        return (
          <Badge variant={badgeVariant as any} className="text-xs">
            {classification}
          </Badge>
        );
      },
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        const materialAllocations = allocations.filter(a => a.material_id === material.id);
        
        // Calculate stock details
        const batches = material.batches || [];
        const { totalStock, allocatedStock, availableStock } = calculateAvailableStock(
          batches,
          materialAllocations
        );
        
        // Get booked allocations only
        const bookedStock = materialAllocations
          .filter(a => a.allocation_type === 'booked')
          .reduce((sum, a) => sum + Number(a.quantity), 0);

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{material.stock.toFixed(2)} {material.unit}</span>
              <Badge variant="outline" className="text-xs">
                Total
              </Badge>
            </div>
            {allocatedStock > 0 && (
              <div className="text-sm text-muted-foreground">
                <div>Available: {availableStock.toFixed(2)} {material.unit}</div>
                <div>Allocated: {allocatedStock.toFixed(2)} {material.unit}</div>
                {bookedStock > 0 && (
                  <div className="font-medium">Booked: {bookedStock.toFixed(2)} {material.unit}</div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Average Cost",
      accessorKey: "costPerUnit",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        return (
          <div className="font-medium">
            {formatCurrency(material.costPerUnit)}
            {material.batches && material.batches.length > 1 && (
              <div className="text-xs text-muted-foreground mt-1">
                (weighted avg. of {material.batches.length} batches)
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Vendor",
      accessorKey: "vendor",
      cell: (props: ColumnCellProps<Material>) => {
        const material = props.row.original;
        return (material.vendor && material.vendor.trim() !== '') ? material.vendor : "-";
      },
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

  return <DataTable columns={materialColumns} data={materialsList} />;
};
