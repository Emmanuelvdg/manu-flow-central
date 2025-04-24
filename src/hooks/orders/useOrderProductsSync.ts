
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrderProductsSync = (orderId: string | undefined, refetchProducts: () => void) => {
  const { toast } = useToast();

  const createOrderProductsFromJSON = async (products: any[]) => {
    if (!orderId) return [];
    const createdProducts = [];
    
    for (const product of products) {
      if (!product.name && !product.id) continue;
      
      // Try to find a matching recipe for this product
      let recipeId = null;
      const productId = product.id || product.name;
      
      if (productId) {
        const { data: recipes } = await supabase
          .from('recipes')
          .select('id')
          .eq('product_id', productId)
          .maybeSingle();
          
        if (recipes) {
          recipeId = recipes.id;
          console.log(`Found recipe ${recipes.id} for product ${productId}`);
        }
      }
      
      // First, check if the product exists in the products table
      const productName = product.name || productId;
      let actualProductId = productId;
      
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', productName)
        .maybeSingle();
        
      if (existingProduct) {
        actualProductId = existingProduct.id;
        console.log(`Found existing product ${actualProductId} for "${productName}"`);
      } else {
        console.log(`Product "${productName}" doesn't exist in products table, creating a stub product`);
        const { data: newProduct, error: createProductError } = await supabase
          .from('products')
          .insert({
            id: productId || `prod-${Date.now()}`,
            name: productName,
            description: `Auto-generated from order ${orderId}`,
            category: product.category || 'General'
          })
          .select()
          .single();
          
        if (createProductError) {
          console.error(`Failed to create product for "${productName}":`, createProductError);
          continue;
        }
        
        actualProductId = newProduct.id;
        console.log(`Created stub product with ID ${actualProductId}`);
      }
      
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
      } else if (data && data.length > 0) {
        const processedProduct = {
          ...data[0],
          product_name: data[0].products?.name ?? data[0].product_id,
          product_description: data[0].products?.description ?? null,
          group: data[0].products?.category ?? null,
          recipe_name: data[0].recipes?.name ?? null,
          recipe_product_name: data[0].recipes?.product_name ?? null
        };
        createdProducts.push(processedProduct);
      }
    }
    
    return createdProducts;
  };

  const syncOrderProducts = async (orderProducts: any[]) => {
    if (!orderId || !orderProducts || !Array.isArray(orderProducts)) {
      console.error("Cannot sync products: Invalid order data");
      return;
    }
    
    try {
      const result = await createOrderProductsFromJSON(orderProducts);
      console.log("Synced order products:", result);
      refetchProducts();
      toast({
        title: "Products synchronized",
        description: `Successfully created ${result.length} product entries for this order.`,
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
