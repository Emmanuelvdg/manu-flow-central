
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { debugRecipeMapping } from "./debugRecipeMapping";

/**
 * Fixes recipe mappings for order products
 * Attempts to find correct recipes based on product ID or name
 */
export const createFixRecipeMappingHook = () => {
  const { toast } = useToast();

  const fixRecipeMapping = async (orderId: string) => {
    try {
      const debug = await debugRecipeMapping(orderId);
      if (!debug) return 0;

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
      return 0;
    }
  };

  return fixRecipeMapping;
};
