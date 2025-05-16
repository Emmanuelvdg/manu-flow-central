
import { useState } from "react";
import { Material } from "@/types/material";

export const useDialogState = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const handleEditMaterial = (material: Material) => {
    const materialCopy = JSON.parse(JSON.stringify(material));
    setSelectedMaterial(materialCopy);
    setIsEditDialogOpen(true);
  };

  const handleCreateOrder = (material: Material) => {
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

  const onCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedMaterial(null);
  };

  const onClosePurchaseDialog = () => {
    setIsPurchaseDialogOpen(false);
    setSelectedMaterial(null);
  };

  return {
    selectedMaterial,
    isEditDialogOpen,
    isPurchaseDialogOpen,
    handleEditMaterial,
    handleCreateOrder,
    handleNewMaterial,
    onCloseEditDialog,
    onClosePurchaseDialog
  };
};
