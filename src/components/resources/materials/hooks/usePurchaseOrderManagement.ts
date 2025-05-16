
import { useToast } from "@/hooks/use-toast";
import { Material, MaterialBatch, PurchaseOrder } from "@/types/material";
import { usePurchaseOrders } from "../../hooks/usePurchaseOrders";
import { useMaterialSave } from "./useMaterialSave";

export const usePurchaseOrderManagement = () => {
  const { toast } = useToast();
  const { handleCreatePurchaseOrder, purchaseOrders } = usePurchaseOrders();
  const { handleSaveMaterial } = useMaterialSave();

  const handleProcessPurchaseOrder = async (order: PurchaseOrder, newBatch: MaterialBatch): Promise<void> => {
    try {
      // Find the material that matches the order
      if (!order.materialId) {
        throw new Error("No material ID provided in order");
      }
      
      // Get the material from queryClient (would need to fetch if not available)
      // For our case, let's assume we just received the material as a prop or through a context
      const selectedMaterial: Material | null = await fetchMaterialById(order.materialId);
      
      if (!selectedMaterial) {
        throw new Error("Material not found");
      }

      // Add the new batch to the selected material's batches
      const updatedMaterial = {
        ...selectedMaterial,
        batches: [...(selectedMaterial.batches || []), newBatch]
      };

      // Save the updated material with the new batch
      await handleSaveMaterial(updatedMaterial);
      
      // Create the purchase order
      await handleCreatePurchaseOrder(order);
      
    } catch (error) {
      console.error("Error creating purchase order and batch:", error);
      toast({
        title: "Error",
        description: `Failed to create purchase order and batch: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };
  
  // Helper function to fetch material by ID - in a real app this would call the API
  const fetchMaterialById = async (materialId: string): Promise<Material | null> => {
    // This is a placeholder. In a real app, this would fetch from the database
    // For now, we'll return null and expect the material to be passed in
    return null;
  };

  return {
    purchaseOrders,
    handleProcessPurchaseOrder
  };
};
