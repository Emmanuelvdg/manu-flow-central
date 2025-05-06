
import { useToast } from "@/hooks/use-toast";
import { debugRecipeMapping } from "./debugRecipeMapping";
import { needsRecipeUpdate } from "./utils/needsRecipeUpdate";
import { findMatchingRecipe } from "./utils/findMatchingRecipe";
import { updateRecipeMapping } from "./utils/updateRecipeMapping";

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

      // Check each product to see if it needs a recipe update
      for (const product of orderProducts || []) {
        if (needsRecipeUpdate(product)) {
          updatesNeeded++;
          
          // Find the correct recipe using multiple matching strategies
          const correctRecipe = await findMatchingRecipe(product, allRecipes);
          
          if (correctRecipe) {
            console.log(`  Found correct recipe: ${correctRecipe.id} (${correctRecipe.name})`);
            
            // Update the order product with the correct recipe
            const updateSuccess = await updateRecipeMapping(product, correctRecipe.id);
            if (updateSuccess) {
              updatesPerformed++;
            }
          } else {
            console.log(`  No matching recipe found for product ${product.product_id}`);
          }
        }
      }

      // Provide appropriate toast notifications based on results
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
