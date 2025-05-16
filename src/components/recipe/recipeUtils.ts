
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  product_id: string;
  product_name: string;
  name: string;
  description?: string;
  materials?: any[];
  personnel?: any[];
  machines?: any[];
  routing_stages?: any[];
  created_at?: string;
  updated_at?: string;
  totalCost?: number;
  variantId?: string;
}

export const fetchRecipes = async (): Promise<Recipe[]> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return null;
  }
};

export const saveRecipe = async (recipe: Partial<Recipe>): Promise<string | null> => {
  try {
    let result;
    
    if (recipe.id && !recipe.id.startsWith('temp-')) {
      // Update existing recipe
      const { data, error } = await supabase
        .from('recipes')
        .update(recipe)
        .eq('id', recipe.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Create new recipe
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    return result?.id || null;
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw error;
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

export const bulkImportRecipes = async (recipes: Partial<Recipe>[]): Promise<void> => {
  try {
    // Process each recipe
    for (const recipe of recipes) {
      if (!recipe.product_id || !recipe.name) {
        throw new Error('Each recipe must have a product_id and name');
      }
      
      // Check if a recipe with this product_id already exists
      const { data: existingRecipe } = await supabase
        .from('recipes')
        .select('id')
        .eq('product_id', recipe.product_id)
        .maybeSingle();
      
      if (existingRecipe) {
        // Update existing recipe
        await supabase
          .from('recipes')
          .update(recipe)
          .eq('id', existingRecipe.id);
      } else {
        // Insert new recipe
        await supabase
          .from('recipes')
          .insert(recipe);
      }
    }
  } catch (error) {
    console.error("Error in bulk import recipes:", error);
    throw error;
  }
};
