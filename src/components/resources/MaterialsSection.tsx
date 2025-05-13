
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Material, PurchaseOrder, MaterialBatch } from "@/types/material";
import { MaterialsTable } from "./MaterialsTable";
import { MaterialsHeader } from "./MaterialsHeader";
import { MaterialDialogs } from "./MaterialDialogs";
import { useMaterials } from "./hooks/useMaterials";
import { PurchaseOrdersSection } from "./PurchaseOrdersSection";
import { usePurchaseOrders } from "./hooks/usePurchaseOrders";
import { ErrorBoundary } from "./ErrorBoundary";
import { MaterialsLoadingState } from "./MaterialsLoadingState";
import { MaterialStockReport } from "./MaterialStockReport";

export const MaterialsSection = () => {
  const { toast } = useToast();
  const { materials, isLoading, error, queryClient, saveMaterialBatches } = useMaterials();
  const { purchaseOrders, handleCreatePurchaseOrder } = usePurchaseOrders();
  
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const handleEditMaterial = (material: Material) => {
    const materialCopy = JSON.parse(JSON.stringify(material));
    setSelectedMaterial(materialCopy);
    setIsEditDialogOpen(true);
  };

  const handleCreateOrder = async (material: Material) => {
    const materialCopy = JSON.parse(JSON.stringify(material));
    setSelectedMaterial(materialCopy);
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
      console.log("Saving material:", updatedMaterial);
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
      
      console.log("Material saved successfully, now saving batches...");
      
      await saveMaterialBatches(updatedMaterial);
      
      await queryClient.invalidateQueries({ queryKey: ["materials"] });
      await queryClient.invalidateQueries({ queryKey: ["material-batches"] });
      
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

  const handleProcessPurchaseOrder = async (order: PurchaseOrder, newBatch: MaterialBatch) => {
    try {
      // Add the new batch to the selected material's batches
      const updatedMaterial = selectedMaterial ? {
        ...selectedMaterial,
        batches: [...(selectedMaterial.batches || []), newBatch]
      } : null;

      if (updatedMaterial) {
        await handleSaveMaterial(updatedMaterial);
      }

      handleCreatePurchaseOrder(order);
      
    } catch (error) {
      console.error("Error creating purchase order and batch:", error);
      toast({
        title: "Error",
        description: `Failed to create purchase order and batch: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleBulkUpload = async (materials: Material[]) => {
    try {
      toast({
        title: "Processing bulk upload",
        description: `Uploading ${materials.length} materials...`,
      });

      // Insert materials one by one (could be optimized with a batch insert)
      for (const material of materials) {
        const materialData = {
          id: material.id,
          name: material.name,
          category: material.category,
          unit: material.unit,
          status: material.status,
          vendor: material.vendor
        };
        
        // Check if material with this name already exists
        const { data: existingMaterial, error: checkError } = await supabase
          .from("materials")
          .select("id")
          .eq("name", material.name)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        if (existingMaterial) {
          // Update existing material
          const { error: updateError } = await supabase
            .from("materials")
            .update(materialData)
            .eq("id", existingMaterial.id);
          if (updateError) throw updateError;
          
          // Use the existing material's ID for the batch
          material.id = existingMaterial.id;
        } else {
          // Insert new material
          const { error: insertError } = await supabase
            .from("materials")
            .insert(materialData);
          if (insertError) throw insertError;
        }
        
        // Create a batch if stock is provided
        if (material.stock && material.stock > 0) {
          // Fix: Convert from camelCase to snake_case for database
          const newBatch = {
            material_id: material.id,
            batch_number: `BULK-${Date.now().toString().slice(-6)}`,
            initial_stock: material.stock,
            remaining_stock: material.stock,
            cost_per_unit: material.costPerUnit || 0,
            purchase_date: new Date().toISOString().split('T')[0],
            status: 'received'
          };
          
          const { error: batchError } = await supabase
            .from("material_batches")
            .insert(newBatch);
          if (batchError) throw batchError;
        }
      }
      
      await queryClient.invalidateQueries({ queryKey: ["materials"] });
      await queryClient.invalidateQueries({ queryKey: ["material-batches"] });
      
      toast({
        title: "Bulk Upload Complete",
        description: `Successfully imported ${materials.length} materials.`,
      });
    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast({
        title: "Bulk Upload Failed",
        description: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading materials</AlertTitle>
        <AlertDescription>{String(error)}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <MaterialsLoadingState />;
  }

  return (
    <div className="space-y-8">
      <ErrorBoundary>
        <>
          <Card>
            <MaterialsHeader 
              onNewMaterial={handleNewMaterial} 
              onBulkUpload={handleBulkUpload}
              existingMaterials={materials}
            />
            <CardContent>
              <MaterialsTable
                materials={materials}
                onEditMaterial={handleEditMaterial}
                onCreateOrder={handleCreateOrder}
                formatCurrency={formatCurrency}
              />
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
            onCloseEditDialog={() => {
              setIsEditDialogOpen(false);
              setSelectedMaterial(null);
            }}
            onClosePurchaseDialog={() => {
              setIsPurchaseDialogOpen(false);
              setSelectedMaterial(null);
            }}
            onSaveMaterial={handleSaveMaterial}
            onCreateOrder={handleProcessPurchaseOrder}
          />
        </>
      </ErrorBoundary>

      <MaterialStockReport />
    </div>
  );
};

export default MaterialsSection;
