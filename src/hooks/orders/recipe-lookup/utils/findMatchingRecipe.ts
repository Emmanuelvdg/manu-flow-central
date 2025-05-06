
import { supabase } from "@/integrations/supabase/client";

/**
 * Finds a matching recipe for a product using various matching strategies
 */
export const findMatchingRecipe = async (product: any, allRecipes: any[]) => {
  console.log(`Finding matching recipe for product ${product.product_id} (${product.products?.name || 'Unknown'})`);
  
  // Find the correct recipe - first try exact match
  let correctRecipe = allRecipes?.find(r => r.product_id === product.product_id);
  
  // If no exact match, try matching by name
  if (!correctRecipe && product.products?.name) {
    console.log(`No exact product_id match, trying name match for: ${product.products.name}`);
    correctRecipe = allRecipes?.find(r => 
      r.product_name && product.products?.name &&
      (r.product_name.toLowerCase().includes(product.products.name.toLowerCase()) ||
      product.products.name.toLowerCase().includes(r.product_name.toLowerCase()))
    );
  }
  
  // If still no match, try partial ID match for "x quantity" cases
  if (!correctRecipe && product.product_id.includes('x ')) {
    const baseId = product.product_id.split('x ')[0].trim();
    console.log(`Trying base ID match for: ${baseId}`);
    correctRecipe = allRecipes?.find(r => r.product_id.startsWith(baseId));
    
    if (!correctRecipe) {
      // Try base name match
      const { data: baseProduct } = await supabase
        .from('products')
        .select('name')
        .eq('id', baseId)
        .maybeSingle();
        
      if (baseProduct?.name) {
        correctRecipe = allRecipes?.find(r => 
          r.product_name && baseProduct.name &&
          (r.product_name.toLowerCase().includes(baseProduct.name.toLowerCase()) ||
            baseProduct.name.toLowerCase().includes(r.product_name.toLowerCase()))
        );
      }
    }
  }
  
  return correctRecipe;
};
