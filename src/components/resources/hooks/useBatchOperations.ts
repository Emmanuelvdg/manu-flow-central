
import { MaterialBatch, Material } from "@/types/material";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useBatchOperations = () => {
  const queryClient = useQueryClient();

  const saveMaterialBatches = async (updatedMaterial: Material) => {
    try {
      console.log("Starting to save batches for material:", updatedMaterial.id);
      
      // Update material data first, including ABC classification
      const { error: materialUpdateError } = await supabase
        .from("materials")
        .update({
          name: updatedMaterial.name,
          category: updatedMaterial.category,
          unit: updatedMaterial.unit,
          vendor: updatedMaterial.vendor,
          abc_classification: updatedMaterial.abcClassification || 'C',
          status: updatedMaterial.status
        })
        .eq("id", updatedMaterial.id);

      if (materialUpdateError) {
        throw materialUpdateError;
      }
      
      // Get existing batches for this material
      const { data: existingBatches, error: fetchError } = await supabase
        .from("material_batches")
        .select("id")
        .eq("material_id", updatedMaterial.id);

      if (fetchError) {
        throw fetchError;
      }

      const existingBatchIds = existingBatches?.map(batch => batch.id) || [];
      const updatedBatchIds = updatedMaterial.batches?.map(batch => batch.id) || [];

      // Find batches to delete (exist in DB but not in updated material)
      const batchesToDelete = existingBatchIds.filter(
        id => !updatedBatchIds.includes(id)
      );

      if (batchesToDelete.length > 0) {
        console.log(`Deleting ${batchesToDelete.length} batches:`, batchesToDelete);
        
        const { error: deleteError } = await supabase
          .from("material_batches")
          .delete()
          .in("id", batchesToDelete);

        if (deleteError) {
          throw deleteError;
        }
      }

      // Process each batch in the updated material
      if (updatedMaterial.batches && updatedMaterial.batches.length > 0) {
        for (const batch of updatedMaterial.batches) {
          // Check if batch has a UUID (already exists in DB)
          const isExisting = existingBatchIds.includes(batch.id);
          
          if (isExisting) {
            // Update existing batch
            console.log("Updating batch:", batch.id);
            
            const { error: updateError } = await supabase
              .from("material_batches")
              .update({
                batch_number: batch.batchNumber,
                initial_stock: batch.initialStock,
                remaining_stock: batch.remainingStock,
                cost_per_unit: batch.costPerUnit,
                purchase_date: batch.purchaseDate,
                expiry_date: batch.expiryDate,
                status: batch.status
              })
              .eq("id", batch.id);

            if (updateError) {
              throw updateError;
            }
          } else {
            // Insert new batch
            console.log("Inserting new batch for material:", updatedMaterial.id);
            
            // Generate UUID if the batch has a temporary ID
            const batchId = batch.id.startsWith('pending-') 
              ? undefined  // Let Supabase generate a UUID
              : batch.id;
              
            const { error: insertError } = await supabase
              .from("material_batches")
              .insert({
                id: batchId,
                material_id: updatedMaterial.id,
                batch_number: batch.batchNumber,
                initial_stock: batch.initialStock,
                remaining_stock: batch.remainingStock,
                cost_per_unit: batch.costPerUnit,
                purchase_date: batch.purchaseDate,
                expiry_date: batch.expiryDate,
                status: batch.status
              });

            if (insertError) {
              throw insertError;
            }
          }
        }
      }
      
      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ["material-batches"] });
      
      console.log("Successfully saved all batches for material:", updatedMaterial.id);
    } catch (error) {
      console.error("Error saving material batches:", error);
      throw error;
    }
  };

  return { saveMaterialBatches };
};
