
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import RequirementsSection from '@/components/recipe/RequirementsSection';
import RecipeFullTable from '@/components/recipe/RecipeFullTable';

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
};

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const recipe = mockRecipes[id as keyof typeof mockRecipes] || mockRecipes["PFP_5L"];

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
