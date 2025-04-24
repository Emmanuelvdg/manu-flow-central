
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Material, MaterialBatch } from "@/types/material";
import { fetchMaterials } from "@/components/recipe/recipeDataUtils";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useMaterials = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  
  // Fetch materials from Supabase
  const { data: dbMaterials = [], isLoading, error } = useQuery({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
  });

  // Fetch batches for all materials
  const { data: batches = [] } = useQuery({
    queryKey: ["material-batches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("material_batches")
        .select("*")
        .order('purchase_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform Supabase column names to match our TypeScript interface
      return data.map(batch => ({
        id: batch.id,
        materialId: batch.material_id,
        batchNumber: batch.batch_number,
        initialStock: batch.initial_stock,
        remainingStock: batch.remaining_stock,
        costPerUnit: batch.cost_per_unit,
        purchaseDate: batch.purchase_date
      })) as MaterialBatch[];
    }
  });

  // Sync 'materials' state when DB loads or batches change
  useEffect(() => {
    if (dbMaterials && dbMaterials.length > 0 && batches) {
      // Explicitly cast dbMaterials to Material[] to ensure TypeScript knows what type we're working with
      const typedMaterials = dbMaterials as Material[];
      
      const formattedMaterials: Material[] = typedMaterials.map((m) => {
        // Find all batches for this material
        const materialBatches = batches
          .filter((b) => b.materialId === m.id)
          .map((b) => ({
            id: b.id,
            materialId: b.materialId,
            batchNumber: b.batchNumber,
            initialStock: b.initialStock,
            remainingStock: b.remainingStock,
            costPerUnit: b.costPerUnit,
            purchaseDate: b.purchaseDate
          }));
        
        // Calculate total stock and average cost
        const totalRemainingStock = materialBatches.reduce(
          (sum, batch) => sum + Number(batch.remainingStock), 
          0
        );
        
        const totalCost = materialBatches.reduce(
          (sum, batch) => 
            sum + (Number(batch.remainingStock) * Number(batch.costPerUnit)), 
          0
        );
        
        const avgCostPerUnit = totalRemainingStock > 0 
          ? totalCost / totalRemainingStock 
          : 0;
        
        return {
          id: m.id,
          name: m.name,
          unit: m.unit,
          category: m.category || "",
          status: m.status || "Active",
          vendor: m.vendor || "",
          batches: materialBatches,
          stock: totalRemainingStock,
          costPerUnit: avgCostPerUnit
        };
      });
      
      setMaterials(formattedMaterials);
    }
  }, [dbMaterials, batches]);

  const saveMaterialBatches = async (material: Material) => {
    if (!material.batches) return;
    
    try {
      console.log(`Saving batches for material: ${material.id}`, material.batches);
      
      // First delete existing batches
      const { error: deleteError } = await supabase
        .from("material_batches")
        .delete()
        .eq("material_id", material.id);
      
      if (deleteError) {
        console.error("Error deleting existing batches:", deleteError);
        throw deleteError;
      }
      
      // Then insert new batches
      if (material.batches.length > 0) {
        const batchesToInsert = material.batches.map(batch => ({
          material_id: material.id,
          batch_number: batch.batchNumber,
          initial_stock: batch.initialStock,
          remaining_stock: batch.remainingStock,
          cost_per_unit: batch.costPerUnit,
          purchase_date: batch.purchaseDate
        }));
        
        console.log("Inserting batches:", batchesToInsert);
        
        const { data, error: insertError } = await supabase
          .from("material_batches")
          .insert(batchesToInsert)
          .select();
        
        if (insertError) {
          console.error("Error inserting batches:", insertError);
          throw insertError;
        }
        
        console.log("Successfully inserted batches:", data);
      }
      
      // Invalidate queries to refresh data
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

  return {
    materials,
    setMaterials,
    isLoading,
    error,
    queryClient,
    saveMaterialBatches
  };
};
