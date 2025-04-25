
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRecipeLookup = () => {
  const { toast } = useToast();

  const findRecipeForProduct = async (productId: string) => {
    if (!productId) {
      console.log("No product ID provided to findRecipeForProduct");
      return null;
    }
    
    try {
      console.log(`Looking up recipe for product ID: ${productId}`);
      
      // First try to find by exact product_id match
      const { data: recipes, error } = await supabase
        .from('recipes')
        .select('id, name, product_name')
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
        console.log(`No recipe found for product ${productId}`);
        return null;
      }
    } catch (err) {
      console.error("Error in findRecipeForProduct:", err);
      return null;
    }
  };

  const debugRecipeMapping = async (orderId: string) => {
    try {
      // Get all order products
      const { data: orderProducts, error: orderError } = await supabase
        .from('order_products')
        .select(`
          id, 
          product_id,
          recipe_id,
          products:product_id (name),
          recipes:recipe_id (name, product_name)
        `)
        .eq('order_id', orderId);

      if (orderError) {
        console.error("Error fetching order products:", orderError);
        return;
      }

      // Get all available recipes
      const { data: allRecipes, error: recipeError } = await supabase
        .from('recipes')
        .select('id, product_id, name, product_name');

      if (recipeError) {
        console.error("Error fetching recipes:", recipeError);
        return;
      }

      console.log("=== Recipe Mapping Debug ===");
      console.log("Order Products:", orderProducts);
      console.log("Available Recipes:", allRecipes);
      
      // Check each order product for correct recipe mapping
      orderProducts?.forEach(product => {
        console.log(`Product: ${product.product_id} (${product.products?.name || 'Unknown'})`);
        console.log(`  Current Recipe: ${product.recipe_id || 'None'} (${product.recipes?.name || 'None'})`);
        
        // Find matching recipes
        const matchingRecipes = allRecipes?.filter(r => r.product_id === product.product_id);
        console.log(`  Available matching recipes: ${matchingRecipes?.length || 0}`);
        matchingRecipes?.forEach(r => {
          console.log(`    - ${r.id}: ${r.name} for ${r.product_name} (${r.product_id})`);
        });
      });
    } catch (err) {
      console.error("Error in debugRecipeMapping:", err);
    }
  };

  return { findRecipeForProduct, debugRecipeMapping };
};
