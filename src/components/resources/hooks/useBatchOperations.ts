
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Material } from "@/types/material";
import { useToast } from "@/hooks/use-toast";

export const useBatchOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveMaterialBatches = async (material: Material) => {
    if (!material.batches) {
      console.log("No batches array found on material:", material);
      material.batches = [];
    }
    
    try {
      console.log(`Saving batches for material: ${material.id}`, material.batches);
      
      const { data: deletedData, error: deleteError } = await supabase
        .from("material_batches")
        .delete()
        .eq("material_id", material.id)
        .select();
      
      if (deleteError) {
        console.error("Error deleting existing batches:", deleteError);
        throw deleteError;
      }
      
      console.log("Successfully deleted existing batches:", deletedData);
      
      if (material.batches && material.batches.length > 0) {
        const validBatches = material.batches.filter(batch => 
          batch.batchNumber && batch.batchNumber.trim() !== ''
        );
        
        console.log(`Found ${validBatches.length} valid batches out of ${material.batches.length} total`);
        
        if (validBatches.length === 0) {
          console.log("No valid batches to insert");
          return;
        }
        
        const batchesToInsert = validBatches.map(batch => ({
          material_id: material.id,
          batch_number: batch.batchNumber,
          initial_stock: Number(batch.initialStock),
          remaining_stock: Number(batch.remainingStock),
          cost_per_unit: Number(batch.costPerUnit),
          purchase_date: batch.purchaseDate
        }));
        
        console.log("Inserting batches:", JSON.stringify(batchesToInsert, null, 2));
        
        const { data, error: insertError } = await supabase
          .from("material_batches")
          .insert(batchesToInsert)
          .select();
        
        if (insertError) {
          console.error("Error inserting batches:", insertError);
          throw insertError;
        }
        
        console.log("Successfully inserted batches:", data);
      } else {
        console.log("No batches to insert for this material");
      }
      
      await queryClient.invalidateQueries({ queryKey: ["material-batches"] });
      
    } catch (error) {
      console.error("Error saving material batches:", error);
      toast({
        title: "Error",
        description: `Failed to save material batches: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  return { saveMaterialBatches };
};
