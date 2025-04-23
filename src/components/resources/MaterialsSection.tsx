import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Material } from "@/types/material";
import { MaterialsTable } from "./MaterialsTable";
import { supabase } from "@/integrations/supabase/client";
import { MaterialsHeader } from "./MaterialsHeader";
import { MaterialDialogs } from "./MaterialDialogs";
import { useMaterials } from "./hooks/useMaterials";
import { PurchaseOrdersSection } from "./PurchaseOrdersSection";
import { usePurchaseOrders } from "./hooks/usePurchaseOrders";

export const MaterialsSection = () => {
  const { toast } = useToast();
  const { materials, setMaterials, isLoading, error, queryClient, saveMaterialBatches } = useMaterials();
  const { purchaseOrders, handleCreatePurchaseOrder } = usePurchaseOrders();
  
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

  const handleNewMaterial = () => {
    setSelectedMaterial({
      id: `mat-${Date.now()}`,
      name: "",
      category: "",
      unit: "",
      status: "Active",
      vendor: "",
      costPerUnit: 0,
      stock: 0,
      batches: []
    });
    setIsEditDialogOpen(true);
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
        vendor: updatedMaterial.vendor,
        costPerUnit: updatedMaterial.costPerUnit,
        stock: updatedMaterial.stock
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
      
      // Save material batches
      await saveMaterialBatches(updatedMaterial);
      
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

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '$0.00';
    try {
      return `$${value.toFixed(2)}`;
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `$${String(value)}`;
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Card>
        <MaterialsHeader 
          onNewMaterial={handleNewMaterial}
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

      <PurchaseOrdersSection 
        purchaseOrders={purchaseOrders}
        materials={materials}
        formatDate={formatDate}
      />

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
