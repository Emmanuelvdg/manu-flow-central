
import { useOrderData } from "./orders/useOrderData";
import { useOrderProducts } from "./orders/useOrderProducts";
import { useOrderProductsSync } from "./orders/useOrderProductsSync";
import { useRecipeLookup } from "./orders/useRecipeLookup";
import { useToast } from "./use-toast";

export const useOrderDetail = (orderId: string | undefined) => {
  const { toast } = useToast();
  
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
  const { debugRecipeMapping, fixRecipeMapping } = useRecipeLookup();

  const debugOrderProductMapping = async () => {
    if (order?.id) {
      await debugRecipeMapping(order.id);
    } else {
      console.error("Cannot debug recipe mapping: No order ID available");
    }
  };

  const fixOrderProductMapping = async () => {
    if (order?.id) {
      await fixRecipeMapping(order.id);
      // Refetch the products to show the updated data
      await refetchProducts();
      toast({
        title: "Recipe mappings checked",
        description: "Recipe mappings have been verified and fixed if needed.",
      });
    } else {
      console.error("Cannot fix recipe mapping: No order ID available");
      toast({
        title: "Cannot fix mappings",
        description: "No order ID available.",
        variant: "destructive",
      });
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
    fixOrderProductMapping,
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

        // Fix recipe mappings if needed
        await fixOrderProductMapping();
      }
    }
  };
};
