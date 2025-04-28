
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrderData = (orderId: string | undefined) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      console.log("Fetching order details for:", orderId);
      
      // Try fetching by order_number first with expanded quote data
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          quotes:quote_id (
            *
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
              *
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
};
