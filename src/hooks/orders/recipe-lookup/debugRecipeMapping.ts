
import { supabase } from "@/integrations/supabase/client";

/**
 * Debug function that prints detailed recipe mapping information for an order
 * Helps diagnose issues with recipe-product relationships
 */
export const debugRecipeMapping = async (orderId: string) => {
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
        // Check if recipe has routing stages - with proper type checking
        const hasRoutingStages = product.recipes?.routing_stages && 
          Array.isArray(product.recipes.routing_stages) && 
          product.recipes.routing_stages.length > 0;
        
        console.log(`  Recipe has routing stages: ${hasRoutingStages ? 'Yes' : 'No'}`);
        
        if (hasRoutingStages && Array.isArray(product.recipes.routing_stages)) {
          console.log(`  Number of routing stages: ${product.recipes.routing_stages.length}`);
          // Type safety check - only iterate if it's an array
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
    return null;
  }
};
