
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseOrdersTable } from "./PurchaseOrdersTable";
import { Material, PurchaseOrder } from "@/types/material";

interface PurchaseOrdersSectionProps {
  purchaseOrders: PurchaseOrder[];
  materials: Material[];
  formatDate: (dateString: string | null | undefined) => string;
}

export const PurchaseOrdersSection: React.FC<PurchaseOrdersSectionProps> = ({
  purchaseOrders,
  materials,
  formatDate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <PurchaseOrdersTable
          purchaseOrders={purchaseOrders}
          materials={materials}
          formatDate={formatDate}
        />
      </CardContent>
    </Card>
  );
};
