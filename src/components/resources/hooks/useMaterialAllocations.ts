
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaterialBatch } from "@/types/material";

export interface MaterialAllocation {
  id: string;
  order_id: string;
  material_id: string;
  quantity: number;
  allocation_type: 'booked' | 'requested' | 'expected';
}

export const useMaterialAllocations = () => {
  return useQuery({
    queryKey: ['material-allocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_allocations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching material allocations:", error);
        throw error;
      }

      return data as MaterialAllocation[];
    }
  });
};

export const calculateAvailableStock = (
  batches: MaterialBatch[],
  allocations: MaterialAllocation[]
) => {
  // Calculate total physical stock from batches
  const totalStock = batches.reduce((sum, batch) => sum + batch.remainingStock, 0);
  
  // Calculate total allocated stock
  const allocatedStock = allocations.reduce((sum, allocation) => sum + allocation.quantity, 0);
  
  return {
    totalStock,
    allocatedStock,
    availableStock: totalStock - allocatedStock
  };
};
