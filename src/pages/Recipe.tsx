
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRecipeData } from '@/hooks/useRecipeData';
import RecipeNotFound from '@/components/recipe/RecipeNotFound';
import RecipeDetails from '@/components/recipe/RecipeDetails';

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { recipe, loading } = useRecipeData(id);

  const handleEdit = () => {
    toast({
      title: "Edit Bill of Materials",
      description: "BOM editing feature coming soon.",
    });
  };
  
  const handleAddMaterial = () => {
    toast({
      title: "Add Material",
      description: "Material addition feature coming soon.",
    });
  };
  
  const handleAddRoutingStage = () => {
    toast({
      title: "Add Routing Stage",
      description: "Routing stage addition feature coming soon.",
    });
  };

  if (loading) {
    return (
      <MainLayout title="Loading Bill of Materials...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading BOM information...</div>
        </div>
      </MainLayout>
    );
  }

  if (!recipe) {
    return (
      <MainLayout title="Bill of Materials Not Found">
        <RecipeNotFound id={id} />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Product BOM Mapping">
      <div className="space-y-5">
        <Button variant="outline" size="sm" asChild>
          <Link to="/recipes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bill of Materials
          </Link>
        </Button>

        <RecipeDetails
          recipe={recipe}
          handleEdit={handleEdit}
          handleAddMaterial={handleAddMaterial}
          handleAddRoutingStage={handleAddRoutingStage}
        />
      </div>
    </MainLayout>
  );
};

export default Recipe;
