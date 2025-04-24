
import { supabase } from "@/integrations/supabase/client";

export const useRecipeLookup = () => {
  const findRecipeForProduct = async (productId: string) => {
    if (!productId) return null;
    
    const { data: recipes } = await supabase
      .from('recipes')
      .select('id')
      .eq('product_id', productId)
      .maybeSingle();
      
    if (recipes) {
      console.log(`Found recipe ${recipes.id} for product ${productId}`);
    }
    return recipes?.id || null;
  };

  return { findRecipeForProduct };
};
