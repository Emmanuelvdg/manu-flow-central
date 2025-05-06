
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates the recipe mapping for an order product
 * @returns true if update was successful, false otherwise
 */
export const updateRecipeMapping = async (product: any, recipeId: string) => {
  console.log(`  Updating recipe mapping for product ${product.id} to recipe ${recipeId}`);
  
  const { error } = await supabase
    .from('order_products')
    .update({ recipe_id: recipeId })
    .eq('id', product.id);
    
  if (error) {
    console.error("  Failed to update recipe mapping:", error);
    return false;
  } else {
    console.log(`  Successfully updated recipe to ${recipeId}`);
    return true;
  }
};
