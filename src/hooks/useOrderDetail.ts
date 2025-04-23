
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOrderDetail = (orderId: string | undefined) => {
  const { toast } = useToast();

  const { 
    data: order, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      console.log("Fetching order details for:", orderId);
      
      // Try fetching by order_number first
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          quotes:quote_id (
            quote_number,
            customer_name,
            products
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
              quote_number,
              customer_name,
              products
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

  const { 
    data: orderProducts = [], 
    isLoading: productsLoading,
    refetch: refetchProducts 
  } = useQuery({
    queryKey: ['orderProducts', order?.id],
    queryFn: async () => {
      if (!order?.id) return [];
      
      try {
        console.log("Fetching products for order ID:", order.id);
        const { data, error } = await supabase
          .from('order_products')
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
          `)
          .eq('order_id', order.id);
          
        if (error) {
          console.error("Error fetching order products:", error);
          throw error;
        }
        
        console.log("Order products data:", data);
        
        // If no products exist in the order_products table but there are products in the order JSON,
        // create them automatically
        if ((!data || data.length === 0) && order.products && Array.isArray(order.products) && order.products.length > 0) {
          console.log("No order products found in database. Creating from order.products:", order.products);
          
          const createdProducts = await createOrderProductsFromJSON(order.id, order.products);
          console.log("Created order products:", createdProducts);
          return createdProducts;
        }
        
        return (data || []).map((row: any) => ({
          ...row,
          product_name: row.products?.name ?? row.product_id,
          product_description: row.products?.description ?? null,
          group: row.products?.category ?? null,
          recipe_name: row.recipes?.name ?? null,
          recipe_product_name: row.recipes?.product_name ?? null
        }));
      } catch (err) {
        console.error("Error in orderProducts query:", err);
        return [];
      }
    },
    enabled: !!order?.id,
  });

  // Helper function to create order_products entries from the order.products JSON
  const createOrderProductsFromJSON = async (orderId: string, products: any[]) => {
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
      
      // Create a new order_product entry
      const productEntry = {
        order_id: orderId,
        product_id: productId,
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

  // Add a function to sync order products
  const syncOrderProducts = async () => {
    if (!order?.id || !order.products || !Array.isArray(order.products)) {
      console.error("Cannot sync products: Invalid order data");
      return;
    }
    
    try {
      const result = await createOrderProductsFromJSON(order.id, order.products);
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

  return {
    order,
    orderProducts,
    isLoading,
    productsLoading,
    error,
    refetch,
    syncOrderProducts
  };
};
