
import React from "react";
import { DataTable, Column, ColumnCellProps } from "@/components/ui/DataTable";
import { PurchaseOrder, Material } from "@/types/material";
import { Badge } from "@/components/ui/badge";

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
  materials: Material[];
  formatDate: (dateString: string | null | undefined) => string;
}

export const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({
  purchaseOrders,
  materials,
  formatDate,
}) => {
  const purchaseOrderColumns: Column<PurchaseOrder>[] = [
    {
      header: "PO #",
      accessorKey: "id",
    },
    {
      header: "Material",
      accessorKey: "materialId",
      cell: (props: ColumnCellProps<PurchaseOrder>) => {
        const materialId = props.getValue();
        const material = materials.find((m) => m.id === materialId);
        return material ? material.name : "Unknown";
      },
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Vendor",
      accessorKey: "vendor",
    },
    {
      header: "Order Date",
      accessorKey: "orderDate",
      cell: (props: ColumnCellProps<PurchaseOrder>) => {
        const dateValue = props.getValue();
        return formatDate(dateValue);
      },
    },
    {
      header: "Expected Delivery",
      accessorKey: "expectedDelivery",
      cell: (props: ColumnCellProps<PurchaseOrder>) => {
        const dateValue = props.getValue();
        return formatDate(dateValue);
      },
    },
    {
      header: "Total Cost",
      accessorKey: "totalCost",
      cell: (props: ColumnCellProps<PurchaseOrder>) => {
        const cost = props.getValue();
        return cost ? `$${Number(cost).toFixed(2)}` : '-';
      }
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (props: ColumnCellProps<PurchaseOrder>) => {
        const status = props.getValue() as string;
        return (
          <Badge
            className={`
              ${status === "delivered" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                status === "ordered" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : 
                status === "requested" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                "bg-gray-100 text-gray-800 hover:bg-gray-200"}
            `}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
  ];

  return (
    <div>
      {purchaseOrders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No purchase orders found. Create orders by clicking "Order" on a material in the Materials tab.
        </div>
      ) : (
        <DataTable columns={purchaseOrderColumns} data={purchaseOrders} />
      )}
    </div>
  );
};
