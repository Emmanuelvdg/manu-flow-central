
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MaterialsMainView } from "@/components/resources/materials/MaterialsMainView";
import { useMaterials } from "@/components/resources/hooks/useMaterials";
import { MaterialEditDialog } from "./MaterialEditDialog";
import { useMaterialSave } from "./materials/hooks/useMaterialSave";
import { Material } from "@/types/material";
import { useBulkUpload } from "./materials/hooks/useBulkUpload";

export const MaterialsSection = () => {
  const { materials, isLoading, error } = useMaterials();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const { handleSaveMaterial } = useMaterialSave();
  const { handleBulkUpload } = useBulkUpload();
  
  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  };

  const handleNewMaterial = () => {
    setSelectedMaterial({
      id: `temp-${Date.now()}`,
      name: "",
      category: "",
      unit: "",
      status: "Active",
      vendor: "",
      stock: 0,
      costPerUnit: 0
    });
    setIsEditDialogOpen(true);
  };

  const onCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedMaterial(null);
  };

  const onSaveMaterial = async (updatedMaterial: Material) => {
    await handleSaveMaterial(updatedMaterial);
    onCloseEditDialog();
  };

  return (
    <Card>
      <MaterialsMainView />

      {isEditDialogOpen && selectedMaterial && (
        <MaterialEditDialog
          material={selectedMaterial}
          isOpen={isEditDialogOpen}
          onClose={onCloseEditDialog}
          onSave={onSaveMaterial}
        />
      )}
    </Card>
  );
};
