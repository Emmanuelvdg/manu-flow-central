
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import RequirementsSection from '@/components/recipe/RequirementsSection';
import RecipeFullTable from '@/components/recipe/RecipeFullTable';
import { supabase } from '@/integrations/supabase/client';

// Enhanced mock recipes to demonstrate mapping (sample data)
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

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      
      try {
        // First check if the ID is a product ID in our mock data
        if (mockRecipes[id as keyof typeof mockRecipes]) {
          setRecipe(mockRecipes[id as keyof typeof mockRecipes]);
          return;
        }

        console.log(`Fetching recipe for ID: ${id}`);
        
        // If not in mock data, try to fetch from database
        // First, check if the ID is a direct recipe ID (UUID format)
        let recipeData = null;
        
        if (id && id.includes('-')) {
          // Looks like a UUID, try to fetch recipe by ID
          const { data: recipeById, error: recipeByIdError } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (recipeByIdError) {
            console.error("Error fetching recipe by ID:", recipeByIdError);
          } else if (recipeById) {
            recipeData = recipeById;
            console.log("Found recipe by ID:", recipeData);
          }
        } 
        
        // If we didn't find it by ID, try by product_id
        if (!recipeData) {
          const { data: recipeByProductId, error: productError } = await supabase
            .from('recipes')
            .select('*')
            .eq('product_id', id)
            .maybeSingle();
            
          if (productError) {
            console.error("Error fetching recipe by product_id:", productError);
          } else if (recipeByProductId) {
            recipeData = recipeByProductId;
            console.log("Found recipe by product_id:", recipeData);
          }
        }
        
        if (recipeData) {
          // Convert to our recipe display format
          const dbRecipe = {
            id: recipeData.id,
            productName: recipeData.product_name || recipeData.name,
            group: "Product Recipe",
            materials: Array.isArray(recipeData.materials) ? recipeData.materials : [],
            personnel: Array.isArray(recipeData.personnel) ? recipeData.personnel : [],
            machines: Array.isArray(recipeData.machines) ? recipeData.machines : [],
          };
          setRecipe(dbRecipe);
        } else {
          console.error(`No recipe found for ID: ${id}`);
          toast({
            title: "Recipe not found",
            description: `No recipe was found for ID: ${id}`,
            variant: "destructive"
          });
          
          // Don't fallback to default recipe anymore
          setRecipe(null);
        }
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

  const handleEdit = () => {
    toast({
      title: "Edit Recipe",
      description: "Recipe editing feature coming soon.",
    });
  };
  
  const handleAddMaterial = () => {
    toast({
      title: "Add Material",
      description: "Material addition feature coming soon.",
    });
  };
  
  const handleAddPersonnel = () => {
    toast({
      title: "Add Personnel",
      description: "Personnel addition feature coming soon.",
    });
  };
  
  const handleAddMachine = () => {
    toast({
      title: "Add Machine",
      description: "Machine addition feature coming soon.",
    });
  };

  if (loading) {
    return (
      <MainLayout title="Loading Recipe...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading recipe information...</div>
        </div>
      </MainLayout>
    );
  }

  if (!recipe) {
    return (
      <MainLayout title="Recipe Not Found">
        <div className="space-y-5">
          <Button variant="outline" size="sm" asChild>
            <Link to="/recipes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recipes
            </Link>
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-amber-500 mb-4 text-6xl">⚠️</div>
                <h2 className="text-2xl font-semibold mb-2">Recipe Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find a recipe for the product ID: {id}
                </p>
                <Button asChild>
                  <Link to="/recipes">View All Recipes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Product Recipe Mapping">
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link to="/recipes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recipes
            </Link>
          </Button>
          <Button variant="default" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Recipe
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{recipe.productName} ({recipe.id})</CardTitle>
            <div className="text-sm text-muted-foreground">{recipe.group}</div>
          </CardHeader>
          <CardContent>
            <RequirementsSection
              materials={recipe.materials}
              personnel={recipe.personnel}
              machines={recipe.machines}
              onAddMaterial={handleAddMaterial}
              onAddPersonnel={handleAddPersonnel}
              onAddMachine={handleAddMachine}
            />
            <RecipeFullTable
              materials={recipe.materials}
              personnel={recipe.personnel}
              machines={recipe.machines}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Recipe;
