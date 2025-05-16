
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Material } from "@/types/material";
import { useQueryClient } from "@tanstack/react-query";

export const useMaterialSave = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSaveMaterial = async (updatedMaterial: Material): Promise<void> => {
    try {
      console.log("Saving material:", updatedMaterial);
      const materials = await queryClient.getQueryData<Material[]>(["materials"]) || [];
      const isNewMaterial = !materials.some((m) => m.id === updatedMaterial.id);
      
      const materialData = {
        id: updatedMaterial.id,
        name: updatedMaterial.name,
        category: updatedMaterial.category,
        unit: updatedMaterial.unit,
        status: updatedMaterial.status,
        vendor: updatedMaterial.vendor
      };
      
      if (isNewMaterial) {
        const { error: insertError } = await supabase.from("materials").insert(materialData);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from("materials")
          .update(materialData)
          .eq("id", updatedMaterial.id);
        if (updateError) throw updateError;
      }
      
      console.log("Material saved successfully, now saving batches...");
      
      await queryClient.invalidateQueries({ queryKey: ["materials"] });
      await queryClient.invalidateQueries({ queryKey: ["material-batches"] });
      
      toast({
        title: `Material ${isNewMaterial ? "Added" : "Updated"}`,
        description: `${updatedMaterial.name} has been ${isNewMaterial ? "added" : "updated"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving material:", error);
      toast({
        title: "Error",
        description: `Failed to save material: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return { handleSaveMaterial, queryClient };
};
