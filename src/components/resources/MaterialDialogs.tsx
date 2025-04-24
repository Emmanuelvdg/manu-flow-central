
import React from "react";
import { MaterialEditDialog } from "./MaterialEditDialog";
import { PurchaseOrderDialog } from "./PurchaseOrderDialog";
import { Material, PurchaseOrder, MaterialBatch } from "@/types/material";

interface MaterialDialogsProps {
  selectedMaterial: Material | null;
  isEditDialogOpen: boolean;
  isPurchaseDialogOpen: boolean;
  onCloseEditDialog: () => void;
  onClosePurchaseDialog: () => void;
  onSaveMaterial: (material: Material) => void;
  onCreateOrder: (order: PurchaseOrder, newBatch: MaterialBatch) => void;
}

export const MaterialDialogs: React.FC<MaterialDialogsProps> = ({
  selectedMaterial,
  isEditDialogOpen,
  isPurchaseDialogOpen,
  onCloseEditDialog,
  onClosePurchaseDialog,
  onSaveMaterial,
  onCreateOrder,
}) => {
  if (!selectedMaterial) return null;

  return (
    <>
      <MaterialEditDialog
        material={selectedMaterial}
        isOpen={isEditDialogOpen}
        onClose={onCloseEditDialog}
        onSave={onSaveMaterial}
      />
      <PurchaseOrderDialog
        material={selectedMaterial}
        isOpen={isPurchaseDialogOpen}
        onClose={onClosePurchaseDialog}
        onCreateOrder={onCreateOrder}
      />
    </>
  );
};
