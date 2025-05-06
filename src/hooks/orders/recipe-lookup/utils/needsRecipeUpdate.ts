
/**
 * Checks if a product needs a recipe update
 * @returns boolean indicating if update is needed
 */
export const needsRecipeUpdate = (product: any) => {
  // Check if there's a mismatch or missing recipe
  return !product.recipe_id || product.recipes?.product_id !== product.product_id;
};
