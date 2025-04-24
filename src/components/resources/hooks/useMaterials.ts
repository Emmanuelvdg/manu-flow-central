
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Material, MaterialBatch } from "@/types/material";
import { fetchMaterials } from "@/components/recipe/recipeDataUtils";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Define an interface for the raw material data coming from the database
interface RawMaterialFromDB {
  id: string;
  name: string;
  category: string | null;
  unit: string;
  status: string | null;
  vendor: string | null;
  created_at: string;
  updated_at: string;
}

export const useMaterials = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  
  // Fetch materials from Supabase
  const { data: dbMaterials = [], isLoading, error } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      // We'll implement our own fetch function here to ensure we're getting all fields
      console.log("Fetching materials directly from database");
      const { data, error } = await supabase
        .from("materials")
        .select("*");
      
      if (error) {
        console.error("Error fetching materials:", error);
        throw error;
      }
      
      console.log("Raw materials data from database:", data);
      return data as RawMaterialFromDB[];
    },
  });

  // Fetch batches for all materials
  const { data: batches = [] } = useQuery({
    queryKey: ["material-batches"],
    queryFn: async () => {
      console.log("Fetching material batches from database");
      const { data, error } = await supabase
        .from("material_batches")
        .select("*")
        .order('purchase_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching material batches:", error);
        throw error;
      }
      
      console.log("Raw batch data from database:", data);
      
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
      console.log("Processing materials with their original properties:", dbMaterials);
      
      const formattedMaterials: Material[] = dbMaterials.map((m) => {
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
        
        // Create a Material object from the raw database material
        const material: Material = {
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
        
        // Log each material's category and vendor for debugging
        console.log(`Material ${m.name} - Category: "${m.category}", Vendor: "${m.vendor}"`);
        
        return material;
      });
      
      // Debugging to verify data
      console.log("Formatted materials with categories and vendors:", formattedMaterials);
      
      setMaterials(formattedMaterials);
    }
  }, [dbMaterials, batches]);

  const saveMaterialBatches = async (material: Material) => {
    if (!material.batches) {
      console.error("No batches array found on material:", material);
      return;
    }
    
    try {
      console.log(`Saving batches for material: ${material.id}`, material.batches);
      
      // First delete existing batches
      console.log(`Deleting existing batches for material ID: ${material.id}`);
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
      
      // Then insert new batches
      if (material.batches.length > 0) {
        // Filter out pending batches (empty ID and batchNumber)
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
      
      // Invalidate queries to refresh data
      console.log("Invalidating material-batches query to refresh data");
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
