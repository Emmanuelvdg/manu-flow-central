
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrderDetail = (orderId: string | undefined) => {
  const { toast } = useToast();

  const { 
    data: order, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      console.log("Fetching order details for:", orderId);
      
      // Try fetching by order_number first
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          quotes:quote_id (
            quote_number,
            customer_name,
            products
          )
        `)
        .eq('order_number', orderId)
        .maybeSingle();
      
      if (error) {
        console.error("Error loading order by order_number:", error);
        throw error;
      }
      
      // If not found by order_number, try by ID
      if (!data && orderId.includes('-')) {
        console.log("Order not found by order_number, trying by ID");
        const { data: dataById, error: errorById } = await supabase
          .from('orders')
          .select(`
            *,
            quotes:quote_id (
              quote_number,
              customer_name,
              products
            )
          `)
          .eq('id', orderId)
          .single();
        
        if (errorById) throw errorById;
        console.log("Found order by ID:", dataById);
        return dataById;
      }
      
      console.log("Found order:", data);
      return data;
    },
    enabled: !!orderId,
    meta: {
      onError: (error) => {
        toast({
          title: "Error loading order",
          description: `Could not load order #${orderId}. Please try again later.`,
          variant: "destructive",
        });
        console.error("Error loading order:", error);
      }
    }
  });

  const { 
    data: orderProducts = [], 
    isLoading: productsLoading 
  } = useQuery({
    queryKey: ['orderProducts', order?.id],
    queryFn: async () => {
      if (!order?.id) return [];
      
      try {
        console.log("Fetching products for order ID:", order.id);
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
          .eq('order_id', order.id);
          
        if (error) {
          console.error("Error fetching order products:", error);
          throw error;
        }
        
        console.log("Order products data:", data);
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
    enabled: !!order?.id,
  });

  return {
    order,
    orderProducts,
    isLoading,
    productsLoading,
    error,
    refetch
  };
};
