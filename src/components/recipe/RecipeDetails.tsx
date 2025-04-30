
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import RequirementsSection from "./RequirementsSection";
import RecipeFullTable from "./RecipeFullTable";

interface RecipeDetailsProps {
  recipe: any;
  handleEdit: () => void;
  handleAddMaterial: () => void;
  handleAddPersonnel: () => void;
  handleAddMachine: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  handleEdit,
  handleAddMaterial,
  handleAddPersonnel,
  handleAddMachine,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{recipe.productName} ({recipe.id})</CardTitle>
            <div className="text-sm text-muted-foreground">{recipe.group}</div>
          </div>
          <Button variant="default" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit BOM
          </Button>
        </div>
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
  );
};

export default RecipeDetails;
