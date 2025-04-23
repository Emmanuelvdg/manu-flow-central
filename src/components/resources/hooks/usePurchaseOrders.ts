
import { useState } from "react";
import { PurchaseOrder } from "@/types/material";

// Mock purchase orders for demo purposes
const mockPurchaseOrders: PurchaseOrder[] = [
  { id: "po-001", materialId: "mat-001", quantity: 20, status: "ordered", orderDate: "2025-03-01", expectedDelivery: "2025-03-15", vendor: "MetalWorks Ltd", totalCost: 250 },
  { id: "po-002", materialId: "mat-004", quantity: 500, status: "delivered", orderDate: "2025-02-15", expectedDelivery: "2025-02-28", vendor: "SealMaster", totalCost: 125 },
  { id: "po-003", materialId: "mat-006", quantity: 50, status: "ordered", orderDate: "2025-03-05", expectedDelivery: "2025-03-20", vendor: "CircuitPro", totalCost: 340 },
];

export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

  const handleCreatePurchaseOrder = (newPO: PurchaseOrder) => {
    setPurchaseOrders([...purchaseOrders, { ...newPO, id: `po-${Date.now()}` }]);
  };

  return {
    purchaseOrders,
    setPurchaseOrders,
    handleCreatePurchaseOrder
  };
};
