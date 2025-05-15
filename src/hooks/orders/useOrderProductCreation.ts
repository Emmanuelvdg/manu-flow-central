
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRecipeLookup } from "./useRecipeLookup";
import { useProductManagement } from "./useProductManagement";

export const useOrderProductCreation = (orderId: string | undefined, refetchProducts: () => void) => {
  const { toast } = useToast();
  const { findRecipeForProduct, debugRecipeMapping } = useRecipeLookup();
  const { findOrCreateProduct } = useProductManagement();

  const createOrderProduct = async (product: any) => {
    if (!orderId) return null;
    if (!product.name && !product.id) return null;

    const productId = product.id || product.name;
    const productName = product.name || productId;
    
    // Extract quantity if included in product name (e.g., "Wooden Table x 6")
    const quantityMatch = productName.match(/\s+x\s+(\d+)$/);
    const explicitQuantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;
    
    try {
      console.log(`Creating order product for: ${productName} (${productId})`);
      
      // First check if this is a custom product that needs to be created
      const isCustomProduct = product.isCustom === true;
      let actualProductId;
      
      if (isCustomProduct) {
        // For custom products, first create an entry in the products table
        const cleanProductName = productName.replace(/\s+x\s+\d+$/, '').trim();
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            id: cleanProductName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20),
            name: cleanProductName,
            description: product.description || `Custom product: ${cleanProductName}`,
            category: 'Custom',
            price: product.price || 0
          })
          .select('id')
          .single();
          
        if (productError) {
          console.error("Error creating custom product:", productError);
          
          // If error is duplicate key, try to fetch the existing product
          if (productError.code === '23505') {
            const { data: existingProduct } = await supabase
              .from('products')
              .select('id')
              .eq('name', cleanProductName)
              .maybeSingle();
              
            if (existingProduct) {
              actualProductId = existingProduct.id;
            } else {
              throw productError;
            }
          } else {
            throw productError;
          }
        } else {
          actualProductId = newProduct.id;
        }
      } else {
        // For regular products, find or reference the product
        actualProductId = await findOrCreateProduct(productName, productId, orderId);
      }
      
      console.log(`Using product ID: ${actualProductId}`);
      
      // Find recipe if exists
      const recipeId = await findRecipeForProduct(actualProductId);
      console.log(`Recipe lookup result: ${recipeId || 'No recipe found'}`);
      
      // Create order product entry
      const productEntry = {
        order_id: orderId,
        product_id: actualProductId,
        quantity: explicitQuantity || parseInt(String(product.quantity)) || 1,
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
      
      console.log("Order product created successfully:", data[0]);
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
      console.log(`Starting sync of ${products.length} products for order ${orderId}`);
      const result = await Promise.all(products.map(createOrderProduct));
      console.log("Synced order products:", result);
      
      // Debug recipe mapping after sync
      await debugRecipeMapping(orderId);
      
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

  return { syncOrderProducts, debugRecipeMapping };
};
