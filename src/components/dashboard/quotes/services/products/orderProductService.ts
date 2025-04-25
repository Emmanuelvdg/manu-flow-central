
import { supabase } from "@/integrations/supabase/client";

// Create order products entries for better data normalization
export const createOrderProducts = async (orderId: string, products: any[]) => {
  try {
    for (const product of products) {
      // Skip if no product name/id
      if (!product.name && !product.id) continue;
      
      // Find recipe for this product if exists
      let recipeId = null;
      
      if (product.id) {
        const { data: recipes } = await supabase
          .from('recipes')
          .select('id')
          .eq('product_id', product.id)
          .maybeSingle();
          
        if (recipes) {
          recipeId = recipes.id;
        }
      }
      
      const productEntry = {
        order_id: orderId,
        product_id: product.id || product.name,
        quantity: parseInt(product.quantity) || 1,
        unit: product.unit || 'pcs',
        status: 'pending',
        materials_status: 'Not booked',
        recipe_id: recipeId
      };
      
      console.log("Creating order product entry:", productEntry);
      
      const { data, error } = await supabase
        .from('order_products')
        .insert(productEntry)
        .select();
        
      if (error) {
        console.error(`Error creating order product entry:`, error);
      } else {
        console.log("Created order product:", data);
      }
    }
  } catch (error) {
    console.error("Error in createOrderProducts:", error);
  }
};
