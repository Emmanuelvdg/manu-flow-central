
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
        console.log(`No recipe found with exact product_id match for ${productId}, checking all recipes`);
        
        // Fetch all recipes to help with debugging
        const { data: allRecipes } = await supabase
          .from('recipes')
          .select('id, name, product_name, product_id');
          
        if (allRecipes && allRecipes.length > 0) {
          console.log("Available recipes:", allRecipes);
        } else {
          console.log("No recipes found in the database");
        }
        
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
          products:product_id (id, name, category, description),
          recipes:recipe_id (id, name, product_name, product_id)
        `)
        .eq('order_id', orderId);

      if (orderError) {
        console.error("Error fetching order products:", orderError);
        return;
      }

      // Get all available recipes
      const { data: allRecipes, error: recipeError } = await supabase
        .from('recipes')
        .select('id, product_id, name, product_name, description');

      if (recipeError) {
        console.error("Error fetching recipes:", recipeError);
        return;
      }

      console.log("=== Recipe Mapping Debug ===");
      console.log(`Order ID: ${orderId}`);
      console.log("Order Products:", orderProducts);
      console.log("Available Recipes:", allRecipes);
      
      // Check each order product for correct recipe mapping
      orderProducts?.forEach(product => {
        console.log(`\nProduct: ${product.product_id} (${product.products?.name || 'Unknown'})`);
        console.log(`  Current Recipe: ${product.recipe_id || 'None'} (${product.recipes?.name || 'None'})`);
        
        // Find matching recipes
        const matchingRecipes = allRecipes?.filter(r => r.product_id === product.product_id);
        console.log(`  Available matching recipes: ${matchingRecipes?.length || 0}`);
        matchingRecipes?.forEach(r => {
          console.log(`    - ${r.id}: ${r.name} (product: ${r.product_name}, product_id: ${r.product_id})`);
        });
        
        // Check for potential mismatches
        if (product.recipe_id && product.recipes?.product_id !== product.product_id) {
          console.error(`  ⚠️ MISMATCH: Recipe ${product.recipe_id} is for product ${product.recipes?.product_id} but assigned to product ${product.product_id}`);
        }
      });

      // Return useful information
      return {
        orderProducts,
        allRecipes
      };
    } catch (err) {
      console.error("Error in debugRecipeMapping:", err);
    }
  };

  const fixRecipeMapping = async (orderId: string) => {
    try {
      const debug = await debugRecipeMapping(orderId);
      if (!debug) return;

      const { orderProducts, allRecipes } = debug;
      let updatesNeeded = 0;
      let updatesPerformed = 0;

      for (const product of orderProducts || []) {
        // Check if there's a mismatch or missing recipe
        const needsUpdate = !product.recipe_id || product.recipes?.product_id !== product.product_id;
        
        if (needsUpdate) {
          updatesNeeded++;
          console.log(`Fixing recipe for product ${product.product_id} (${product.products?.name || 'Unknown'})`);
          
          // Find the correct recipe
          const correctRecipe = allRecipes?.find(r => r.product_id === product.product_id);
          
          if (correctRecipe) {
            console.log(`  Found correct recipe: ${correctRecipe.id} (${correctRecipe.name})`);
            
            // Update the order product
            const { error } = await supabase
              .from('order_products')
              .update({ recipe_id: correctRecipe.id })
              .eq('id', product.id);
              
            if (error) {
              console.error("  Failed to update recipe mapping:", error);
            } else {
              updatesPerformed++;
              console.log(`  Successfully updated recipe to ${correctRecipe.id}`);
            }
          } else {
            console.log(`  No matching recipe found for product ${product.product_id}`);
          }
        }
      }

      if (updatesNeeded === 0) {
        console.log("No recipe mapping fixes needed!");
      } else {
        console.log(`Fixed ${updatesPerformed}/${updatesNeeded} recipe mappings`);
        
        if (updatesPerformed > 0) {
          toast({
            title: "Recipe mappings updated",
            description: `Successfully fixed ${updatesPerformed} recipe mappings.`,
          });
        }
      }
    } catch (err) {
      console.error("Error in fixRecipeMapping:", err);
    }
  };

  return { 
    findRecipeForProduct, 
    debugRecipeMapping,
    fixRecipeMapping 
  };
};
