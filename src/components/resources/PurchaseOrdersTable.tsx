
import React from "react";
import { DataTable, Column, ColumnCellProps } from "@/components/ui/DataTable";
import { PurchaseOrder, Material } from "@/types/material";

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
      cell: (props: ColumnCellProps<PurchaseOrder>) => formatDate(props.getValue()),
    },
    {
      header: "Expected Delivery",
      accessorKey: "expectedDelivery",
      cell: (props: ColumnCellProps<PurchaseOrder>) => formatDate(props.getValue()),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (props: ColumnCellProps<PurchaseOrder>) => {
        const status = props.getValue() as string;
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              status === "delivered"
                ? "bg-green-100 text-green-800"
                : status === "ordered"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
  ];

  return <DataTable columns={purchaseOrderColumns} data={purchaseOrders} />;
};
