
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  product_id: string;
  product_name: string;
  name: string;
  description?: string;
  materials?: any;   // JSON
  personnel?: any;   // JSON
  machines?: any;    // JSON
  created_at: string;
  updated_at: string;
}

// Fetch all recipes
export const fetchRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

// Fetch a single recipe by product_id
export const fetchRecipeByProductId = async (product_id: string): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("product_id", product_id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Insert a new recipe
export const insertRecipe = async (recipe: Omit<Recipe, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from("recipes")
    .insert(recipe)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Update recipe by id
export const updateRecipe = async (id: string, fields: Partial<Recipe>) => {
  const { data, error } = await supabase
    .from("recipes")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Delete recipe by id
export const deleteRecipe = async (id: string) => {
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
};
