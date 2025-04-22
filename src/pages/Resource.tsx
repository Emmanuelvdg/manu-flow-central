import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column, ColumnCellProps } from "@/components/ui/DataTable";
import { Plus, ArrowUpDown } from "lucide-react";
import { MaterialEditDialog } from "@/components/resources/MaterialEditDialog";
import { PurchaseOrderDialog } from "@/components/resources/PurchaseOrderDialog";
import { Material, MaterialBatch, PurchaseOrder } from "@/types/material";

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

  // Helper function to calculate total stock from batches
  const calculateTotalStock = (material: Material): number => {
    return material.batches?.reduce((sum, batch) => sum + (batch.remainingStock || 0), 0) || 0;
  };

  // Helper function to calculate average cost per unit from batches
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
              onClick={() => {
                setSelectedMaterial(material);
                setIsEditDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedMaterial(material);
                setIsPurchaseDialogOpen(true);
              }}
            >
              Order
            </Button>
          </div>
        );
      },
    },
  ];

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

  return (
    <MainLayout title="Resources & Inventory">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Materials</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                // Create a new empty material template
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
            <DataTable
              columns={materialColumns}
              data={materials}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={purchaseOrderColumns}
              data={purchaseOrders}
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
