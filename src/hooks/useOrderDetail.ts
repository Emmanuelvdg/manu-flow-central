
import { useOrderData } from "./orders/useOrderData";
import { useOrderProducts } from "./orders/useOrderProducts";
import { useOrderProductsSync } from "./orders/useOrderProductsSync";
import { useRecipeLookup } from "./orders/useRecipeLookup";

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

  const { syncOrderProducts, debugRecipeMapping } = useOrderProductsSync(order?.id, refetchProducts);
  const { debugRecipeMapping: debugRecipes } = useRecipeLookup();

  const debugOrderProductMapping = async () => {
    if (order?.id) {
      await debugRecipes(order.id);
    } else {
      console.error("Cannot debug recipe mapping: No order ID available");
    }
  };

  return {
    order,
    orderProducts,
    isLoading,
    productsLoading,
    error,
    refetch,
    debugOrderProductMapping,
    syncOrderProducts: async () => {
      if (order?.products) {
        // Make sure we're handling products as an array
        const productsArray = Array.isArray(order.products) 
          ? order.products 
          : typeof order.products === 'object' && order.products !== null
            ? [order.products]
            : [];
        
        console.log("Syncing products:", productsArray);
        await syncOrderProducts(productsArray);
        
        // Debug recipe mapping after sync
        await debugOrderProductMapping();
      }
    }
  };
};
