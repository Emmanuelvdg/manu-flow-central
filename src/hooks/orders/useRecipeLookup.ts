
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

  const debugRecipeMapping = async (orderId: string) => {
    try {
      console.log(`=== DEBUG: Recipe Mapping for Order ${orderId} ===`);
      
      // Get all order products
      const { data: orderProducts, error: orderError } = await supabase
        .from('order_products')
        .select(`
          id, 
          product_id,
          recipe_id,
          products:product_id (id, name, category, description),
          recipes:recipe_id (id, name, product_name, product_id, routing_stages)
        `)
        .eq('order_id', orderId);

      if (orderError) {
        console.error("Error fetching order products:", orderError);
        return;
      }

      if (!orderProducts || orderProducts.length === 0) {
        console.log("No products found for this order");
        return;
      }

      console.log(`Found ${orderProducts.length} products in the order`);

      // Get all available recipes
      const { data: allRecipes, error: recipeError } = await supabase
        .from('recipes')
        .select('id, product_id, name, product_name, description, routing_stages');

      if (recipeError) {
        console.error("Error fetching recipes:", recipeError);
        return;
      }

      console.log(`Found ${allRecipes?.length || 0} recipes in the database`);
      
      // Check each order product for correct recipe mapping
      for (const product of orderProducts) {
        console.log(`\nProduct: ${product.product_id} (${product.products?.name || 'Unknown'})`);
        console.log(`  Current Recipe: ${product.recipe_id || 'None'} (${product.recipes?.name || 'None'})`);
        
        if (product.recipe_id) {
          // Check if recipe has routing stages
          const hasRoutingStages = product.recipes?.routing_stages && 
            Array.isArray(product.recipes.routing_stages) && 
            product.recipes.routing_stages.length > 0;
          
          console.log(`  Recipe has routing stages: ${hasRoutingStages ? 'Yes' : 'No'}`);
          
          if (hasRoutingStages) {
            console.log(`  Number of routing stages: ${product.recipes.routing_stages.length}`);
            product.recipes.routing_stages.forEach((stage: any, index: number) => {
              console.log(`    Stage ${index + 1}: ${stage.stage_name} (${stage.hours} hrs)`);
            });
          }
        }
        
        // Find matching recipes
        const matchingRecipes = allRecipes?.filter(r => r.product_id === product.product_id) || [];
        console.log(`  Available matching recipes: ${matchingRecipes?.length || 0}`);
        matchingRecipes?.forEach(r => {
          console.log(`    - ${r.id}: ${r.name} (product: ${r.product_name}, product_id: ${r.product_id})`);
        });
        
        // Check for potential mismatches
        if (product.recipe_id && product.recipes?.product_id !== product.product_id) {
          console.error(`  ⚠️ MISMATCH: Recipe ${product.recipe_id} is for product ${product.recipes?.product_id} but assigned to product ${product.product_id}`);
        }
      }

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
        toast({
          title: "Recipe mappings verified",
          description: "All recipe mappings are correct.",
        });
      } else {
        console.log(`Fixed ${updatesPerformed}/${updatesNeeded} recipe mappings`);
        
        if (updatesPerformed > 0) {
          toast({
            title: "Recipe mappings updated",
            description: `Successfully fixed ${updatesPerformed} recipe mappings.`,
          });
        }
      }
      
      return updatesPerformed;
    } catch (err) {
      console.error("Error in fixRecipeMapping:", err);
      toast({
        title: "Error fixing recipe mappings",
        description: "An error occurred while trying to fix recipe mappings.",
        variant: "destructive",
      });
    }
  };

  return { 
    findRecipeForProduct, 
    debugRecipeMapping,
    fixRecipeMapping 
  };
};
