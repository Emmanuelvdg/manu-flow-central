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

      try {
        // First, fetch the order basic info
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('id, order_number, customer_name, created_at')
          .eq('id', orderId)
          .maybeSingle();

        if (orderError) throw orderError;
        if (!orderData) return null;

        // Then fetch order products with product names
        const { data: orderProducts, error: productsError } = await supabase
          .from('order_products')
          .select(`
            id,
            product_id,
            quantity,
            products (
              name
            )
          `)
          .eq('order_id', orderId);

        if (productsError) throw productsError;
        if (!orderProducts?.length) {
          return {
            orderId: orderData.id,
            orderNumber: orderData.order_number,
            customerName: orderData.customer_name,
            products: [],
            totalItems: 0,
            completedItems: 0,
            createdAt: orderData.created_at,
          };
        }

        // Fetch stage progress for all order products
        const orderProductIds = orderProducts.map(op => op.id);
        const { data: stageProgressData, error: stageError } = await supabase
          .from('order_stage_progress')
          .select('*')
          .in('order_product_id', orderProductIds);

        if (stageError) throw stageError;

        // Map the data together
        const products = orderProducts.map((op: any) => {
          const stageProgress = (stageProgressData || [])
            .filter((sp: any) => sp.order_product_id === op.id)
            .map((sp: any) => ({
              stageId: sp.stage_id,
              stageName: sp.stage_name,
              yetToStartUnits: sp.yet_to_start_units || 0,
              inProgressUnits: sp.in_progress_units || 0,
              completedUnits: sp.completed_units || 0,
              totalUnits: sp.total_units || op.quantity,
            }));

          return {
            id: op.id,
            productName: op.products?.name || op.product_id,
            quantity: op.quantity,
            stageProgress,
          };
        });

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
      } catch (error) {
        console.error('Error fetching order processing data:', error);
        throw error;
      }
    },
    enabled: !!orderId,
    retry: 1,
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