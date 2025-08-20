import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrderProcessingData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  products: Array<{
    id: string;
    productName: string;
    quantity: number;
    stageProgress: Array<{
      stageId: string;
      stageName: string;
      yetToStartUnits: number;
      inProgressUnits: number;
      completedUnits: number;
      totalUnits: number;
    }>;
  }>;
  totalItems: number;
  completedItems: number;
  createdAt: string;
}

export interface StageProgressData {
  date: string;
  stages: Record<string, number>;
  totalRemaining: number;
  ideal: number;
}

export const useOrderProcessingData = (orderId?: string) => {
  return useQuery({
    queryKey: ['orderProcessingData', orderId],
    queryFn: async (): Promise<OrderProcessingData | null> => {
      if (!orderId) return null;

      // Fetch order with products and stage progress
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          created_at,
          order_products (
            id,
            product_id,
            quantity,
            products (
              name
            ),
            order_stage_progress (
              stage_id,
              stage_name,
              yet_to_start_units,
              in_progress_units,
              completed_units,
              total_units
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      if (!orderData) return null;

      const products = orderData.order_products.map((op: any) => ({
        id: op.id,
        productName: op.products?.name || op.product_id,
        quantity: op.quantity,
        stageProgress: op.order_stage_progress.map((sp: any) => ({
          stageId: sp.stage_id,
          stageName: sp.stage_name,
          yetToStartUnits: sp.yet_to_start_units,
          inProgressUnits: sp.in_progress_units,
          completedUnits: sp.completed_units,
          totalUnits: sp.total_units,
        })),
      }));

      const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
      const completedItems = products.reduce(
        (sum, p) => sum + p.stageProgress.reduce((stageSum, s) => stageSum + s.completedUnits, 0),
        0
      );

      return {
        orderId: orderData.id,
        orderNumber: orderData.order_number,
        customerName: orderData.customer_name,
        products,
        totalItems,
        completedItems,
        createdAt: orderData.created_at,
      };
    },
    enabled: !!orderId,
  });
};

export const useOrdersList = () => {
  return useQuery({
    queryKey: ['ordersForProcessing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};