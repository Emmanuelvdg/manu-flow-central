
import { supabase } from "@/integrations/supabase/client";

// Create order products entries for better data normalization
export const createOrderProducts = async (orderId: string, products: any[]) => {
  try {
    for (const product of products) {
      // Skip if no product name/id
      if (!product.name && !product.id) continue;
      
      // Extract quantity if included in product name
      const productName = product.name || product.id;
      const quantityMatch = productName.match(/\s+x\s+(\d+)$/);
      const explicitQuantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;
      const cleanProductName = productName.replace(/\s+x\s+\d+$/, '').trim();
      
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
      
      // Look for existing product but don't create if not found
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', cleanProductName)
        .maybeSingle();
      
      // Use existing product ID if found, otherwise use a reference ID with REF_ prefix
      // to clearly indicate it's not a real product ID
      const productId = product.id || 
        (existingProduct?.id || 
         `REF_${cleanProductName
           .replace(/[^a-zA-Z0-9]/g, '_')
           .replace(/_+/g, '_')
           .toUpperCase()
           .substring(0, 15)}`);
      
      const productEntry = {
        order_id: orderId,
        product_id: productId,
        quantity: explicitQuantity || parseInt(product.quantity) || 1,
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
