
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOrderProducts = (orderId: string | undefined) => {
  return useQuery({
    queryKey: ['orderProducts', orderId],
    queryFn: async () => {
      if (!orderId) return [];
      
      try {
        console.log("Fetching products for order ID:", orderId);
        const { data, error } = await supabase
          .from('order_products')
          .select(`
            *,
            products:product_id (
              name,
              description,
              category
            ),
            recipes:recipe_id (
              id,
              name,
              product_name
            )
          `)
          .eq('order_id', orderId);
          
        if (error) {
          console.error("Error fetching order products:", error);
          throw error;
        }
        
        return (data || []).map((row: any) => ({
          ...row,
          product_name: row.products?.name ?? row.product_id,
          product_description: row.products?.description ?? null,
          group: row.products?.category ?? null,
          recipe_name: row.recipes?.name ?? null,
          recipe_product_name: row.recipes?.product_name ?? null
        }));
      } catch (err) {
        console.error("Error in orderProducts query:", err);
        return [];
      }
    },
    enabled: !!orderId,
  });
};
