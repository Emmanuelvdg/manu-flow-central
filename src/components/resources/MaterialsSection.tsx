
import React, { useState } from "react";
import { MaterialsTable } from "./MaterialsTable";
import { MaterialDialogs } from "./MaterialDialogs";
import { PurchaseOrder, MaterialBatch, Material } from "@/types/material";

export const MaterialsSection: React.FC = () => {
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
  
  // Make sure these functions return Promises
  const handleSaveMaterial = async (material: Material): Promise<void> => {
    // Placeholder: Implement your existing save material logic here
    console.log("Saving material:", material);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };
  
  const handleCreateOrder = async (order: PurchaseOrder, newBatch: MaterialBatch): Promise<void> => {
    // Placeholder: Implement your existing create order logic here
    console.log("Creating order:", order, newBatch);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };
  
  return (
    <div className="space-y-4">
      <MaterialsTable 
        materials={[]} // Make sure to pass the materials array here
        onEditMaterial={handleEditMaterial}
        onCreateOrder={handleCreateOrder}
        formatCurrency={(value) => `$${(value || 0).toFixed(2)}`}
      />
      
      <MaterialDialogs
        selectedMaterial={selectedMaterial}
        isEditDialogOpen={isEditDialogOpen}
        isPurchaseDialogOpen={isPurchaseDialogOpen}
        onCloseEditDialog={() => setIsEditDialogOpen(false)}
        onClosePurchaseDialog={() => setIsPurchaseDialogOpen(false)}
        onSaveMaterial={handleSaveMaterial}
        onCreateOrder={handleCreateOrder}
      />
    </div>
  );
};
