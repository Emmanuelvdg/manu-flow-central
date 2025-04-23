
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
      return data || [];
    }
  });

  // Sync 'materials' state when DB loads
  useEffect(() => {
    if (dbMaterials && dbMaterials.length > 0) {
      const formattedMaterials: Material[] = dbMaterials.map((m) => {
        // Find all batches for this material
        const materialBatches = batches.filter(
          (b: any) => b.material_id === m.id
        ).map((b: any) => ({
          id: b.id,
          materialId: b.material_id,
          batchNumber: b.batch_number,
          initialStock: b.initial_stock,
          remainingStock: b.remaining_stock,
          costPerUnit: b.cost_per_unit,
          purchaseDate: b.purchase_date
        }));
        
        // Calculate total stock and average cost
        const totalRemainingStock = materialBatches.reduce(
          (sum: number, batch: MaterialBatch) => sum + Number(batch.remainingStock), 
          0
        );
        
        const totalCost = materialBatches.reduce(
          (sum: number, batch: MaterialBatch) => 
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
          category: (m as any).category || "",
          status: (m as any).status || "Active",
          vendor: (m as any).vendor || "",
          batches: materialBatches,
          stock: totalRemainingStock,
          costPerUnit: avgCostPerUnit
        };
      });
      
      setMaterials(formattedMaterials);
    }
  }, [dbMaterials, batches]);

  // Update material batches
  const saveMaterialBatches = async (material: Material) => {
    if (!material.batches || material.batches.length === 0) return;
    
    try {
      // Delete existing batches for this material
      const { error: deleteError } = await supabase
        .from("material_batches")
        .delete()
        .eq("material_id", material.id);
      
      if (deleteError) throw deleteError;
      
      // Insert new batches
      const batchesToInsert = material.batches.map(batch => ({
        material_id: material.id,
        batch_number: batch.batchNumber,
        initial_stock: batch.initialStock,
        remaining_stock: batch.remainingStock,
        cost_per_unit: batch.costPerUnit,
        purchase_date: batch.purchaseDate
      }));
      
      const { error: insertError } = await supabase
        .from("material_batches")
        .insert(batchesToInsert);
      
      if (insertError) throw insertError;
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["material-batches"] });
      
    } catch (error) {
      console.error("Error saving material batches:", error);
      toast({
        title: "Error",
        description: "Failed to save material batches",
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
