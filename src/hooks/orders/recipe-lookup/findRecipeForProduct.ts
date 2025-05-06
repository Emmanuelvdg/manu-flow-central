
import { supabase } from "@/integrations/supabase/client";

/**
 * Finds the appropriate recipe ID for a given product ID
 * Implements multiple matching strategies:
 * 1. Exact product_id match
 * 2. Product name match
 * 3. Base product ID match (for "x quantity" products)
 */
export const findRecipeForProduct = async (productId: string) => {
  if (!productId) {
    console.log("No product ID provided to findRecipeForProduct");
    return null;
  }
  
  try {
    console.log(`Looking up recipe for product ID: ${productId}`);
    
    // First try to find by exact product_id match
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, name, product_name, product_id')
      .eq('product_id', productId)
      .maybeSingle();
      
    if (error) {
      console.error("Error finding recipe by product ID:", error);
      return null;
    }
    
    if (recipes) {
      console.log(`Found recipe ${recipes.id} (${recipes.name}) for product ${productId}`);
      return recipes.id;
    } else {
      // If no recipe found, log more details to help debug
      console.log(`No recipe found with exact product_id match for ${productId}, checking product name match`);
      
      // Try to find by product name (for cases where product_id might be different but name matches)
      const { data: productNameMatch, error: productNameError } = await supabase
        .from('products')
        .select('name')
        .eq('id', productId)
        .maybeSingle();
        
      if (!productNameError && productNameMatch) {
        console.log(`Found product name: ${productNameMatch.name}, searching for recipe with matching product_name`);
        
        // Try both exact matches and pattern matches
        const { data: nameRecipes, error: nameError } = await supabase
          .from('recipes')
          .select('id, name, product_name, product_id')
          .or(`product_name.eq.${productNameMatch.name},product_name.ilike.${productNameMatch.name}%,product_name.ilike.%${productNameMatch.name}%`)
          .order('created_at', { ascending: false });
          
        if (!nameError && nameRecipes && nameRecipes.length > 0) {
          console.log(`Found ${nameRecipes.length} recipes by product name match for ${productId}`);
          return nameRecipes[0].id;
        }
      }
      
      // If still no match, check for partial matches in case of "Wooden Table x 11" type product IDs
      if (productId.includes('x ')) {
        const baseProductId = productId.split('x ')[0].trim();
        console.log(`Checking for base product ID match: ${baseProductId}`);
        
        const { data: baseRecipes, error: baseError } = await supabase
          .from('recipes')
          .select('id, name, product_name, product_id')
          .or(`product_id.eq.${baseProductId},product_id.ilike.${baseProductId}%`)
          .order('created_at', { ascending: false });
          
        if (!baseError && baseRecipes && baseRecipes.length > 0) {
          console.log(`Found ${baseRecipes.length} recipes by base product ID match for ${productId}`);
          return baseRecipes[0].id;
        }
        
        // Last resort - check for base product name match using the base ID
        const { data: baseProduct, error: baseProductError } = await supabase
          .from('products')
          .select('name')
          .eq('id', baseProductId)
          .maybeSingle();
          
        if (!baseProductError && baseProduct) {
          const { data: baseNameMatch, error: baseNameError } = await supabase
            .from('recipes')
            .select('id, name, product_name, product_id')
            .or(`product_name.eq.${baseProduct.name},product_name.ilike.${baseProduct.name}%,product_name.ilike.%${baseProduct.name}%`)
            .order('created_at', { ascending: false });
            
          if (!baseNameError && baseNameMatch && baseNameMatch.length > 0) {
            console.log(`Found ${baseNameMatch.length} recipes by base product name match for ${productId}`);
            return baseNameMatch[0].id;
          }
        }
      }
      
      // No recipes found for this product ID
      console.log(`No matching recipe found for product ID: ${productId}`);
      return null;
    }
  } catch (err) {
    console.error("Error in findRecipeForProduct:", err);
    return null;
  }
};
