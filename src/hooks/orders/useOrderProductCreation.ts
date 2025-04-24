
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRecipeLookup } from "./useRecipeLookup";
import { useProductManagement } from "./useProductManagement";

export const useOrderProductCreation = (orderId: string | undefined, refetchProducts: () => void) => {
  const { toast } = useToast();
  const { findRecipeForProduct } = useRecipeLookup();
  const { findOrCreateProduct } = useProductManagement();

  const createOrderProduct = async (product: any) => {
    if (!orderId) return null;
    if (!product.name && !product.id) return null;

    const productId = product.id || product.name;
    const productName = product.name || productId;
    
    try {
      // Find or create the product
      const actualProductId = await findOrCreateProduct(productName, productId, orderId);
      
      // Find recipe if exists
      const recipeId = await findRecipeForProduct(actualProductId);
      
      // Create order product entry
      const productEntry = {
        order_id: orderId,
        product_id: actualProductId,
        quantity: parseInt(String(product.quantity)) || 1,
        unit: product.unit || 'pcs',
        status: 'pending',
        materials_status: 'Not booked',
        recipe_id: recipeId
      };
      
      console.log("Creating order product entry:", productEntry);
      
      const { data, error } = await supabase
        .from('order_products')
        .insert(productEntry)
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
        `);
        
      if (error) {
        console.error("Error creating order product:", error);
        throw error;
      }
      
      return data[0];
    } catch (err) {
      console.error("Error in createOrderProduct:", err);
      throw err;
    }
  };

  const syncOrderProducts = async (products: any[]) => {
    if (!orderId || !products || !Array.isArray(products)) {
      console.error("Cannot sync products: Invalid order data");
      return;
    }
    
    try {
      const result = await Promise.all(products.map(createOrderProduct));
      console.log("Synced order products:", result);
      refetchProducts();
      toast({
        title: "Products synchronized",
        description: `Successfully created ${result.filter(Boolean).length} product entries for this order.`,
      });
    } catch (err) {
      console.error("Error syncing order products:", err);
      toast({
        title: "Sync failed",
        description: "Failed to synchronize products. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { syncOrderProducts };
};
