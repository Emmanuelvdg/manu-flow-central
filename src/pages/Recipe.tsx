
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
        // Check if the ID is a productID that matches our mock data
        if (mockRecipes[id as keyof typeof mockRecipes]) {
          setRecipe(mockRecipes[id as keyof typeof mockRecipes]);
          return;
        }

        // If not in mock data, try to fetch from database
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .or(`id.eq.${id},product_id.eq.${id}`)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          // If found in DB, convert to mock recipe format
          const dbRecipe = {
            id: data.id,
            productName: data.product_name,
            // Use a default group if no field exists in the DB record
            group: "Product Recipe", // Changed from data.category to a default value
            materials: Array.isArray(data.materials) ? data.materials : [],
            personnel: Array.isArray(data.personnel) ? data.personnel : [],
            machines: Array.isArray(data.machines) ? data.machines : [],
          };
          setRecipe(dbRecipe);
        } else {
          // Fallback to default recipe if nothing found
          setRecipe(mockRecipes["WT"]);
          console.error(`No recipe found for ID: ${id}`);
          toast({
            title: "Recipe not found",
            description: `Using default recipe. No recipe was found for ID: ${id}`,
          });
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setRecipe(mockRecipes["WT"]);
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

        {recipe && (
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
        )}
      </div>
    </MainLayout>
  );
};

export default Recipe;
