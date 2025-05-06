
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaterialBatch } from "@/types/material";

export const useMaterialBatches = () => {
  return useQuery({
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
      
      return data.map(batch => ({
        id: batch.id,
        materialId: batch.material_id,
        batchNumber: batch.batch_number,
        initialStock: batch.initial_stock,
        remainingStock: batch.remaining_stock,
        costPerUnit: batch.cost_per_unit,
        purchaseDate: batch.purchase_date,
        expiryDate: batch.expiry_date,
        deliveredDate: batch.delivered_date,
        status: batch.status
      })) as MaterialBatch[];
    }
  });
};
