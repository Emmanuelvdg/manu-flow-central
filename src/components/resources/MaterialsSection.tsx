
import React from "react";
import { MaterialsTable } from "./MaterialsTable";
import { MaterialDialogs } from "./MaterialDialogs";
import { PurchaseOrder, MaterialBatch, Material } from "@/types/material";
import { useMaterialsManager } from "./materials/hooks/useMaterialsManager";

export const MaterialsSection: React.FC = () => {
  const {
    materials,
    selectedMaterial,
    isLoading,
    error,
    isEditDialogOpen,
    isPurchaseDialogOpen,
    formatCurrency,
    handleEditMaterial,
    handleCreateOrder,
    handleSaveMaterial,
    handleProcessPurchaseOrder,
    onCloseEditDialog,
    onClosePurchaseDialog
  } = useMaterialsManager();
  
  // If data is loading, show loading state
  if (isLoading) {
    return <div className="p-8 text-center">Loading materials data...</div>;
  }
  
  // If there's an error, show error message
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading materials: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <MaterialsTable 
        materials={materials}
        onEditMaterial={handleEditMaterial}
        onCreateOrder={handleCreateOrder}
        formatCurrency={formatCurrency}
      />
      
      <MaterialDialogs
        selectedMaterial={selectedMaterial}
        isEditDialogOpen={isEditDialogOpen}
        isPurchaseDialogOpen={isPurchaseDialogOpen}
        onCloseEditDialog={onCloseEditDialog}
        onClosePurchaseDialog={onClosePurchaseDialog}
        onSaveMaterial={handleSaveMaterial}
        onCreateOrder={handleProcessPurchaseOrder}
      />
    </div>
  );
};
