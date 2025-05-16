
import { useMaterials } from "../../hooks/useMaterials";
import { useDialogState } from "./useDialogState";
import { useMaterialSave } from "./useMaterialSave";
import { usePurchaseOrderManagement } from "./usePurchaseOrderManagement";
import { useBulkUpload } from "./useBulkUpload";
import { formatCurrency, formatDate } from "../utils/formatUtils";
import { Material } from "@/types/material";

export const useMaterialsManager = () => {
  // Import hooks we've extracted
  const { materials, isLoading, error, queryClient, saveMaterialBatches } = useMaterials();
  
  const { 
    selectedMaterial, 
    isEditDialogOpen, 
    isPurchaseDialogOpen,
    handleEditMaterial,
    handleCreateOrder,
    handleNewMaterial,
    onCloseEditDialog,
    onClosePurchaseDialog
  } = useDialogState();
  
  const { handleSaveMaterial } = useMaterialSave();
  const { handleProcessPurchaseOrder, purchaseOrders } = usePurchaseOrderManagement();
  const { handleBulkUpload } = useBulkUpload();

  // Combine the handleSaveMaterial to use the saveMaterialBatches from useMaterials
  const combinedSaveMaterial = async (updatedMaterial: Material): Promise<void> => {
    try {
      await handleSaveMaterial(updatedMaterial);
      await saveMaterialBatches(updatedMaterial);
    } catch (error) {
      console.error("Error in combined save:", error);
    }
  };

  return {
    // Data
    materials,
    selectedMaterial,
    isLoading,
    error,
    isEditDialogOpen,
    isPurchaseDialogOpen,
    purchaseOrders,
    
    // Utils
    formatCurrency,
    formatDate,
    
    // Handlers
    handleEditMaterial,
    handleCreateOrder,
    handleNewMaterial,
    handleSaveMaterial: combinedSaveMaterial,
    handleProcessPurchaseOrder,
    handleBulkUpload,
    onCloseEditDialog,
    onClosePurchaseDialog
  };
};
