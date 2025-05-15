
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MaterialsTableRows from "./MaterialsTableRows";
import PersonnelRow from "./PersonnelRow";
import MachineRow from "./MachineRow";
import TotalCostRow from "./TotalCostRow";
import RecipeStats from "./RecipeStats";
import StageGroupRows from "./StageGroupRows";
import { RecipeFilters, RecipeTableFilters } from "./RecipeTableFilters";

// Define interface for the component props
interface RecipeFullTableProps {
  recipe?: any;
  materials?: any[];
  routingStages?: any[];
  materialCosts?: {
    individualCosts?: any[];
    totalCost: number;
  };
}

export default function RecipeFullTable({ 
  recipe, 
  materials, 
  routingStages, 
  materialCosts 
}: RecipeFullTableProps) {
  const [quantity, setQuantity] = useState(1);
  const [showStats, setShowStats] = useState(false);
  const [filterStage, setFilterStage] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  
  // Process the input props or use recipe object
  const recipeMaterials = materials || (recipe?.materials || []);
  const recipeStages = routingStages || (recipe?.routing_stages || []);
  const recipeCosts = materialCosts || (recipe?.totalCost 
    ? {
        individualCosts: recipeMaterials.map((m: any) => ({
          ...m,
          cost: 0,
          costPerUnit: 0
        })),
        totalCost: recipe.totalCost
      }
    : { individualCosts: [], totalCost: 0 });
  
  useEffect(() => {
    if (materialCosts?.totalCost) {
      setTotalCost(materialCosts.totalCost * quantity);
    } else if (recipe?.totalCost) {
      setTotalCost(recipe.totalCost * quantity);
    }
  }, [quantity, recipe, materialCosts]);
  
  if (!recipe && !materials && !routingStages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No recipe data available.</p>
        </CardContent>
      </Card>
    );
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1;
    setQuantity(value > 0 ? value : 1);
  };
  
  // Get unique stages for filtering
  const stages = recipeStages 
    ? [...new Set(recipeStages.map(stage => stage.stage_name || stage.name))]
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{recipe?.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{recipe?.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="quantity" className="text-sm font-medium block mb-1">
                Quantity:
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                className="w-20"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <RecipeStats 
              recipe={recipe} 
              quantity={quantity} 
              showStats={showStats}
              setShowStats={setShowStats}
            />
          </div>
        </div>
        
        <RecipeTableFilters 
          stages={stages} 
          filterStage={filterStage} 
          setFilterStage={setFilterStage} 
        />
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Item</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Materials Section */}
              {recipeMaterials && recipeMaterials.length > 0 && (
                <MaterialsTableRows 
                  materials={recipeMaterials} 
                  materialCosts={recipeCosts.individualCosts || []}
                />
              )}
              
              {/* Routing Stages Section */}
              {recipeStages && recipeStages.length > 0 && (
                recipeStages.map((stage) => (
                  <StageGroupRows 
                    key={stage.id || stage.stage_id}
                    stage={stage}
                  />
                ))
              )}
              
              {/* Total Cost */}
              <TotalCostRow cost={totalCost} />
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
