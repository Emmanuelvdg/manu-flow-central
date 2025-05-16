
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
    
    // Parse the JSON fields to ensure they're arrays
    return data?.map(recipe => ({
      ...recipe,
      materials: parseJsonField(recipe.materials),
      personnel: parseJsonField(recipe.personnel),
      machines: parseJsonField(recipe.machines),
      routing_stages: parseJsonField(recipe.routing_stages)
    })) || [];
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
    
    if (!data) return null;
    
    // Parse the JSON fields to ensure they're arrays
    return {
      ...data,
      materials: parseJsonField(data.materials),
      personnel: parseJsonField(data.personnel),
      machines: parseJsonField(data.machines),
      routing_stages: parseJsonField(data.routing_stages)
    };
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return null;
  }
};

export const saveRecipe = async (recipe: Partial<Recipe>): Promise<string | null> => {
  try {
    let result;
    
    // Ensure required fields are present for new recipes
    if (!recipe.id || recipe.id.startsWith('temp-')) {
      if (!recipe.name || !recipe.product_id || !recipe.product_name) {
        throw new Error('Recipe name, product_id, and product_name are required');
      }
    }
    
    // Prepare data for database by ensuring JSON compatibility
    const recipeData = {
      ...recipe,
      // Convert arrays to JSON strings if needed
      materials: recipe.materials ? JSON.parse(JSON.stringify(recipe.materials)) : undefined,
      personnel: recipe.personnel ? JSON.parse(JSON.stringify(recipe.personnel)) : undefined,
      machines: recipe.machines ? JSON.parse(JSON.stringify(recipe.machines)) : undefined,
      routing_stages: recipe.routing_stages ? JSON.parse(JSON.stringify(recipe.routing_stages)) : undefined,
    };
    
    if (recipe.id && !recipe.id.startsWith('temp-')) {
      // Update existing recipe
      const { data, error } = await supabase
        .from('recipes')
        .update(recipeData)
        .eq('id', recipe.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Create new recipe - ensure required fields are present
      const insertData = {
        product_id: recipe.product_id!,
        product_name: recipe.product_name!,
        name: recipe.name!,
        description: recipe.description || '',
        materials: recipeData.materials,
        personnel: recipeData.personnel,
        machines: recipeData.machines,
        routing_stages: recipeData.routing_stages,
        totalCost: recipe.totalCost
      };
      
      const { data, error } = await supabase
        .from('recipes')
        .insert(insertData)
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
      
      // Prepare recipe data for database
      const recipeData = {
        product_id: recipe.product_id,
        product_name: recipe.product_name || '', // Provide fallback for required field
        name: recipe.name,
        description: recipe.description || '',
        // Convert arrays to JSON-compatible format
        materials: recipe.materials ? JSON.parse(JSON.stringify(recipe.materials)) : [],
        routing_stages: recipe.routing_stages ? JSON.parse(JSON.stringify(recipe.routing_stages)) : []
      };
      
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
          .update(recipeData)
          .eq('id', existingRecipe.id);
      } else {
        // Insert new recipe
        await supabase
          .from('recipes')
          .insert(recipeData);
      }
    }
  } catch (error) {
    console.error("Error in bulk import recipes:", error);
    throw error;
  }
};

// Helper function to parse JSON fields safely
function parseJsonField(field: any): any[] {
  if (!field) return [];
  
  try {
    // If it's already an array, return it
    if (Array.isArray(field)) return field;
    
    // If it's a string, try to parse it
    if (typeof field === 'string') {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    // If it's an object but not an array, return empty array
    return [];
  } catch (e) {
    console.error("Error parsing JSON field:", e);
    return [];
  }
}
