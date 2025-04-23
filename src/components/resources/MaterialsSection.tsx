import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Material, PurchaseOrder } from "@/types/material";
import { MaterialsTable } from "./MaterialsTable";
import { PurchaseOrdersTable } from "./PurchaseOrdersTable";
import { supabase } from "@/integrations/supabase/client";
import { MaterialsHeader } from "./MaterialsHeader";
import { MaterialDialogs } from "./MaterialDialogs";
import { useMaterials } from "./hooks/useMaterials";

// We'll provide fallback mock POs only for demo—real data integration can be added later if relevant.
const mockPurchaseOrders: PurchaseOrder[] = [
  { id: "po-001", materialId: "mat-001", quantity: 20, status: "ordered", orderDate: "2025-03-01", expectedDelivery: "2025-03-15", vendor: "MetalWorks Ltd", totalCost: 250 },
  { id: "po-002", materialId: "mat-004", quantity: 500, status: "delivered", orderDate: "2025-02-15", expectedDelivery: "2025-02-28", vendor: "SealMaster", totalCost: 125 },
  { id: "po-003", materialId: "mat-006", quantity: 50, status: "ordered", orderDate: "2025-03-05", expectedDelivery: "2025-03-20", vendor: "CircuitPro", totalCost: 340 },
];

export const MaterialsSection = () => {
  const { toast } = useToast();
  const { materials, setMaterials, isLoading, error, queryClient } = useMaterials();
  
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  };

  const handleCreateOrder = (material: Material) => {
    setSelectedMaterial(material);
    setIsPurchaseDialogOpen(true);
  };

  const handleSaveMaterial = async (updatedMaterial: Material) => {
    try {
      const isNewMaterial = !materials.some((m) => m.id === updatedMaterial.id);
      
      const materialData = {
        id: updatedMaterial.id,
        name: updatedMaterial.name,
        category: updatedMaterial.category,
        unit: updatedMaterial.unit,
        status: updatedMaterial.status,
        vendor: updatedMaterial.vendor
      };
      
      if (isNewMaterial) {
        const { error: insertError } = await supabase.from("materials").insert(materialData);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from("materials")
          .update(materialData)
          .eq("id", updatedMaterial.id);
        if (updateError) throw updateError;
      }
      
      await queryClient.invalidateQueries({ queryKey: ["materials"] });
      
      setMaterials(prev => {
        const filtered = prev.filter((m) => m.id !== updatedMaterial.id);
        return [...filtered, updatedMaterial];
      });
      
      toast({
        title: `Material ${isNewMaterial ? "Added" : "Updated"}`,
        description: `${updatedMaterial.name} has been ${isNewMaterial ? "added" : "updated"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving material:", error);
      toast({
        title: "Error",
        description: `Failed to save material: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleCreatePurchaseOrder = (newPO: PurchaseOrder) => {
    setPurchaseOrders([...purchaseOrders, { ...newPO, id: `po-${Date.now()}` }]);
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '$0.00';
    try {
      return `$${value.toFixed(2)}`;
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `$${String(value)}`;
    }
  };

  return (
    <>
      <Card>
        <MaterialsHeader 
          onNewMaterial={() => {
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
        />
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground py-8 text-center">Loading materials...</div>
          ) : error ? (
            <div className="text-destructive py-8 text-center">Could not load materials. {String(error)}</div>
          ) : (
            <MaterialsTable
              materials={materials}
              onEditMaterial={handleEditMaterial}
              onCreateOrder={handleCreateOrder}
              formatCurrency={formatCurrency}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <PurchaseOrdersTable
            purchaseOrders={purchaseOrders}
            materials={materials}
            formatDate={(date) => new Date(date).toLocaleDateString()}
          />
        </CardContent>
      </Card>

      <MaterialDialogs
        selectedMaterial={selectedMaterial}
        isEditDialogOpen={isEditDialogOpen}
        isPurchaseDialogOpen={isPurchaseDialogOpen}
        onCloseEditDialog={() => setIsEditDialogOpen(false)}
        onClosePurchaseDialog={() => setIsPurchaseDialogOpen(false)}
        onSaveMaterial={handleSaveMaterial}
        onCreateOrder={handleCreatePurchaseOrder}
      />
    </>
  );
};
