
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Material } from "@/types/material";
import { useQueryClient } from "@tanstack/react-query";

export const useBulkUpload = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return { handleBulkUpload };
};
