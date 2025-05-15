
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import RequirementsSection from "./RequirementsSection";
import RecipeFullTable from "./RecipeFullTable";

interface RecipeDetailsProps {
  recipe: any;
  handleEdit: () => void;
  handleAddMaterial: () => void;
  handleAddRoutingStage: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  handleEdit,
  handleAddMaterial,
  handleAddRoutingStage,
}) => {
  const [quantity, setQuantity] = useState(1);
  
  // Make sure we have the expected structure, with backward compatibility
  const routingStages = recipe.routing_stages || recipe.stages || [];
  const materials = recipe.materials || [];
  
  // Extract all personnel and machines from routing stages for backward compatibility
  const extractPersonnelFromStages = () => {
    return routingStages.flatMap(stage => stage.personnel || []);
  };
  
  const extractMachinesFromStages = () => {
    return routingStages.flatMap(stage => stage.machines || []);
  };
  
  // Handle legacy format where personnel and machines are at root level
  const personnel = recipe.personnel || extractPersonnelFromStages();
  const machines = recipe.machines || extractMachinesFromStages();

  // Format material costs for the table
  const materialCosts = {
    individualCosts: materials.map((m: any) => ({
      id: m.id || m.material_id,
      name: m.name || "",
      quantity: m.quantity || 0,
      unit: m.unit || "",
      cost: (m.quantity || 0) * (m.costPerUnit || 0),
      costPerUnit: m.costPerUnit || 0
    })),
    totalCost: recipe.totalCost || 0
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{recipe.productName} ({recipe.id})</CardTitle>
            <div className="text-sm text-muted-foreground">{recipe.group}</div>
            {recipe.totalCost > 0 && (
              <div className="text-sm font-medium text-red-600 mt-1">
                COGS: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(recipe.totalCost)}
              </div>
            )}
          </div>
          <Button variant="default" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit BOM
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RequirementsSection
          materials={materials}
          personnel={personnel}
          machines={machines}
          routingStages={routingStages}
          onAddMaterial={handleAddMaterial}
          onAddRoutingStage={handleAddRoutingStage}
        />
        <RecipeFullTable 
          materials={materials}
          routingStages={routingStages}
          materialCosts={materialCosts}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </CardContent>
    </Card>
  );
};

export default RecipeDetails;
