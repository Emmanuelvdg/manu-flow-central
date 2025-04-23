
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
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderId)
        .maybeSingle();
      
      if (error) {
        console.error("Error loading order by order_number:", error);
        throw error;
      }
      
      if (!data && orderId.includes('-')) {
        const { data: dataById, error: errorById } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (errorById) throw errorById;
        return dataById;
      }
      
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
        const { data, error } = await supabase
          .from('order_products')
          .select(`
            *,
            products:product_id (
              name,
              description,
              category
            )
          `)
          .eq('order_id', order.id);
          
        if (error) {
          console.error("Error fetching order products:", error);
          throw error;
        }
        
        return (data || []).map((row: any) => ({
          ...row,
          product_name: row.products?.name ?? row.product_id,
          product_description: row.products?.description ?? null,
          group: row.products?.category ?? null,
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
