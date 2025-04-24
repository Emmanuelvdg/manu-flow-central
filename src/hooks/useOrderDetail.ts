
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
    syncOrderProducts: () => {
      if (order?.products) {
        syncOrderProducts(order.products);
      }
    }
  };
};
