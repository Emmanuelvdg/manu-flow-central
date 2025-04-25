
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
  
  // Calculate allocated stock - only count booked and requested allocations
  // Expected allocations represent future stock but don't reduce current available stock
  const allocatedStock = allocations
    .filter(allocation => ['booked', 'requested'].includes(allocation.allocation_type))
    .reduce((sum, allocation) => sum + allocation.quantity, 0);
  
  // Available stock is total minus allocated
  const availableStock = Math.max(0, totalStock - allocatedStock);
  
  return {
    totalStock,
    allocatedStock,
    availableStock
  };
};
