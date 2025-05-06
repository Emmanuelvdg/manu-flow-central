
import { useToast } from "@/hooks/use-toast";
import { findRecipeForProduct } from "./recipe-lookup/findRecipeForProduct";
import { debugRecipeMapping } from "./recipe-lookup/debugRecipeMapping";
import { createFixRecipeMappingHook } from "./recipe-lookup/fixRecipeMapping";

/**
 * Hook that provides recipe lookup functionality for order products
 * Helps map products to recipes and fix mismatches
 */
export const useRecipeLookup = () => {
  const { toast } = useToast();
  
  // Create the fixRecipeMapping function with toast functionality
  const fixRecipeMapping = createFixRecipeMappingHook();

  return { 
    findRecipeForProduct, 
    debugRecipeMapping,
    fixRecipeMapping 
  };
};
