import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MaterialEditDialog } from "@/components/resources/MaterialEditDialog";
import { PurchaseOrderDialog } from "@/components/resources/PurchaseOrderDialog";
import { Material, MaterialBatch, PurchaseOrder } from "@/types/material";
import { MaterialsTable } from "@/components/resources/MaterialsTable";
import { PurchaseOrdersTable } from "@/components/resources/PurchaseOrdersTable";

// Mock data
const mockMaterials: Material[] = [
  { id: "mat-001", name: "Aluminum Sheet 1mm", category: "Metals", unit: "sqm", status: "Active", vendor: "MetalWorks Ltd", batches: [{ id: "batch-001", materialId: "mat-001", batchNumber: "B001", initialStock: 50, remainingStock: 45, costPerUnit: 12.5, purchaseDate: "2025-01-15" }] },
  { id: "mat-002", name: "Copper Wire 2mm", category: "Metals", unit: "m", status: "Active", vendor: "ElectroSupplies Inc", batches: [{ id: "batch-002", materialId: "mat-002", batchNumber: "B001", initialStock: 200, remainingStock: 175, costPerUnit: 8.75, purchaseDate: "2025-02-03" }] },
  { id: "mat-003", name: "Stainless Steel Bolt M8", category: "Fasteners", unit: "pcs", status: "Active", vendor: "FastFix Co", batches: [{ id: "batch-003", materialId: "mat-003", batchNumber: "B001", initialStock: 1000, remainingStock: 850, costPerUnit: 0.45, purchaseDate: "2025-01-21" }] },
  { id: "mat-004", name: "Rubber O-Ring 20mm", category: "Seals", unit: "pcs", status: "Active", vendor: "SealMaster", batches: [{ id: "batch-004", materialId: "mat-004", batchNumber: "B001", initialStock: 500, remainingStock: 320, costPerUnit: 0.25, purchaseDate: "2025-02-12" }] },
  { id: "mat-005", name: "Plastic Casing Type A", category: "Housings", unit: "pcs", status: "Active", vendor: "PlastiCorp", batches: [{ id: "batch-005", materialId: "mat-005", batchNumber: "B001", initialStock: 100, remainingStock: 78, costPerUnit: 4.50, purchaseDate: "2025-01-18" }] },
  { id: "mat-006", name: "PCB Board 50x50mm", category: "Electronics", unit: "pcs", status: "Active", vendor: "CircuitPro", batches: [{ id: "batch-006", materialId: "mat-006", batchNumber: "B001", initialStock: 150, remainingStock: 125, costPerUnit: 6.80, purchaseDate: "2025-02-05" }] },
  { id: "mat-007", name: "LED Light 5mm", category: "Electronics", unit: "pcs", status: "Active", vendor: "LightTech", batches: [{ id: "batch-007", materialId: "mat-007", batchNumber: "B001", initialStock: 1000, remainingStock: 750, costPerUnit: 0.15, purchaseDate: "2025-01-25" }] },
  { id: "mat-008", name: "Glass Panel 10x10cm", category: "Glass", unit: "pcs", status: "Active", vendor: "GlassMasters", batches: [{ id: "batch-008", materialId: "mat-008", batchNumber: "B001", initialStock: 75, remainingStock: 62, costPerUnit: 7.25, purchaseDate: "2025-02-08" }] },
  { id: "mat-009", name: "Hydraulic Fluid Type B", category: "Fluids", unit: "L", status: "Active", vendor: "FluidDynamics", batches: [{ id: "batch-009", materialId: "mat-009", batchNumber: "B001", initialStock: 200, remainingStock: 155, costPerUnit: 11.50, purchaseDate: "2025-01-15" }] },
];

// Mock purchase orders
const mockPurchaseOrders: PurchaseOrder[] = [
  { id: "po-001", materialId: "mat-001", quantity: 20, status: "ordered", orderDate: "2025-03-01", expectedDelivery: "2025-03-15", vendor: "MetalWorks Ltd", totalCost: 250 },
  { id: "po-002", materialId: "mat-004", quantity: 500, status: "delivered", orderDate: "2025-02-15", expectedDelivery: "2025-02-28", vendor: "SealMaster", totalCost: 125 },
  { id: "po-003", materialId: "mat-006", quantity: 50, status: "ordered", orderDate: "2025-03-05", expectedDelivery: "2025-03-20", vendor: "CircuitPro", totalCost: 340 },
];

const Resource = () => {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  // Safe date formatting function
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(dateString);
    }
  };

  // Safe currency formatting function
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '$0.00';
    try {
      return `$${value.toFixed(2)}`;
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `$${String(value)}`;
    }
  };

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  };

  const handleCreateOrder = (material: Material) => {
    setSelectedMaterial(material);
    setIsPurchaseDialogOpen(true);
  };

  const handleSaveMaterial = (updatedMaterial: Material) => {
    setMaterials(
      materials.map((mat) =>
        mat.id === updatedMaterial.id ? updatedMaterial : mat
      )
    );
  };

  const handleCreatePurchaseOrder = (newPO: PurchaseOrder) => {
    setPurchaseOrders([...purchaseOrders, { ...newPO, id: `po-${Date.now()}` }]);
  };

  return (
    <MainLayout title="Resources & Inventory">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Materials</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setSelectedMaterial({
                  id: `mat-${Date.now()}`,
                  name: "",
                  category: "",
                  unit: "",
                  status: "Active",
                  vendor: "",
                  batches: [],
                });
                setIsEditDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Material
            </Button>
          </CardHeader>
          <CardContent>
            <MaterialsTable
              materials={materials}
              onEditMaterial={handleEditMaterial}
              onCreateOrder={handleCreateOrder}
              formatCurrency={formatCurrency}
            />
          </CardContent>
        </Card>

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
      </div>

      {selectedMaterial && (
        <>
          <MaterialEditDialog
            material={selectedMaterial}
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSave={handleSaveMaterial}
          />
          <PurchaseOrderDialog
            material={selectedMaterial}
            isOpen={isPurchaseDialogOpen}
            onClose={() => setIsPurchaseDialogOpen(false)}
            onCreateOrder={handleCreatePurchaseOrder}
          />
        </>
      )}
    </MainLayout>
  );
};

export default Resource;
