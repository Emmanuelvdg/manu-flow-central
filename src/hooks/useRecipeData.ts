
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Mock recipes (sample data)
const mockRecipes = {
  "PFP_5L": {
    id: "PFP_5L",
    productName: "Packaged Food Product, 5L Canister",
    group: "Food: Finished goods",
    materials: [
      { id: "MAT-010", name: "Plastic Canister 5L", quantity: 1, unit: "pcs" },
      { id: "MAT-005", name: "Label", quantity: 1, unit: "pcs" },
      { id: "MAT-003", name: "Food filling", quantity: 5, unit: "l" }
    ],
    personnel: [
      { id: "1", role: "Packaging Operator", hours: 2 },
      { id: "2", role: "Quality Inspector", hours: 1 }
    ],
    machines: [
      { id: "MACH-003", machine: "Filling Line", hours: 1.5 },
      { id: "MACH-004", machine: "Labeling Machine", hours: 0.5 }
    ]
  },
  "WT": {
    id: "WT",
    productName: "Wooden Table",
    group: "Tables: Finished goods",
    materials: [
      { id: "MAT-011", name: "Wood Panel", quantity: 3, unit: "pcs" },
      { id: "MAT-012", name: "Table Legs", quantity: 4, unit: "pcs" },
      { id: "MAT-005", name: "Screws", quantity: 8, unit: "pcs" }
    ],
    personnel: [
      { id: "3", role: "Carpenter", hours: 3 },
      { id: "4", role: "Assembler", hours: 1 }
    ],
    machines: [
      { id: "MACH-008", machine: "Table Saw", hours: 1 },
      { id: "MACH-012", machine: "Drill Press", hours: 0.5 }
    ]
  },
  "BO00001": {
    id: "BO00001",
    productName: "Mechanical Subassembly BOM",
    group: "Mechanical: Subassemblies",
    materials: [
      { id: "MAT-020", name: "Metal Frame", quantity: 1, unit: "pcs" },
      { id: "MAT-021", name: "Screws", quantity: 12, unit: "pcs" },
      { id: "MAT-022", name: "Washers", quantity: 12, unit: "pcs" }
    ],
    personnel: [
      { id: "5", role: "Assembly Technician", hours: 2 },
      { id: "6", role: "Quality Control", hours: 0.5 }
    ],
    machines: [
      { id: "MACH-009", machine: "Assembly Station", hours: 1.5 },
      { id: "MACH-010", machine: "Testing Equipment", hours: 0.5 }
    ]
  }
};

export const useRecipeData = (id: string | undefined) => {
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Log the ID we're trying to fetch
        console.log(`Fetching recipe for ID: ${id}`);
        
        // First check if the ID is a UUID format (recipe ID)
        if (id && id.includes('-')) {
          console.log("Appears to be a UUID, fetching recipe by ID");
          const { data: recipeById, error: recipeByIdError } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (recipeByIdError) {
            console.error("Error fetching recipe by ID:", recipeByIdError);
          } else if (recipeById) {
            console.log("Found recipe by ID:", recipeById);
            
            // Convert to our recipe display format
            const dbRecipe = {
              id: recipeById.id,
              productName: recipeById.product_name || recipeById.name,
              group: "Product Recipe",
              materials: Array.isArray(recipeById.materials) ? recipeById.materials : [],
              personnel: Array.isArray(recipeById.personnel) ? recipeById.personnel : [],
              machines: Array.isArray(recipeById.machines) ? recipeById.machines : [],
            };
            setRecipe(dbRecipe);
            setLoading(false);
            return;
          }
        }
        
        // If not a UUID or not found by UUID, check mock data
        if (mockRecipes[id as keyof typeof mockRecipes]) {
          console.log("Found in mock data:", mockRecipes[id as keyof typeof mockRecipes]);
          setRecipe(mockRecipes[id as keyof typeof mockRecipes]);
          setLoading(false);
          return;
        }

        console.log("Not found in mock data, trying to fetch from database by product_id");
        // Try to fetch by product_id
        const { data: recipeByProductId, error: productError } = await supabase
          .from('recipes')
          .select('*')
          .eq('product_id', id)
          .maybeSingle();
          
        if (productError) {
          console.error("Error fetching recipe by product_id:", productError);
        } else if (recipeByProductId) {
          console.log("Found recipe by product_id:", recipeByProductId);
          
          // Convert to our recipe display format
          const dbRecipe = {
            id: recipeByProductId.id,
            productName: recipeByProductId.product_name || recipeByProductId.name,
            group: "Product Recipe",
            materials: Array.isArray(recipeByProductId.materials) ? recipeByProductId.materials : [],
            personnel: Array.isArray(recipeByProductId.personnel) ? recipeByProductId.personnel : [],
            machines: Array.isArray(recipeByProductId.machines) ? recipeByProductId.machines : [],
          };
          setRecipe(dbRecipe);
          setLoading(false);
          return;
        }
        
        // If we get here, we didn't find a recipe
        console.error(`No recipe found for ID: ${id}`);
        toast({
          title: "Recipe not found",
          description: `No recipe was found for ID: ${id}`,
          variant: "destructive"
        });
        setRecipe(null);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast({
          title: "Error loading recipe",
          description: "There was a problem loading the recipe. Please try again.",
          variant: "destructive"
        });
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id, toast]);

  return { recipe, loading };
};
