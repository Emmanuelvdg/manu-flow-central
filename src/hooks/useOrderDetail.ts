
import { useOrderData } from "./orders/useOrderData";
import { useOrderProducts } from "./orders/useOrderProducts";
import { useOrderProductsSync } from "./orders/useOrderProductsSync";

export const useOrderDetail = (orderId: string | undefined) => {
  const { 
    data: order, 
    isLoading, 
    error,
    refetch 
  } = useOrderData(orderId);

  const {
    data: orderProducts = [],
    isLoading: productsLoading,
    refetch: refetchProducts
  } = useOrderProducts(order?.id);

  const { syncOrderProducts } = useOrderProductsSync(order?.id, refetchProducts);

  return {
    order,
    orderProducts,
    isLoading,
    productsLoading,
    error,
    refetch,
    syncOrderProducts: async () => {
      if (order?.products) {
        // Make sure we're handling products as an array
        const productsArray = Array.isArray(order.products) 
          ? order.products 
          : typeof order.products === 'object' && order.products !== null
            ? [order.products]
            : [];
        
        await syncOrderProducts(productsArray);
      }
    }
  };
};
