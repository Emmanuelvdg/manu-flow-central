
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MaterialsTableRows } from "./MaterialsTableRows";
import { PersonnelRow } from "./PersonnelRow";
import { MachineRow } from "./MachineRow";
import { TotalCostRow } from "./TotalCostRow";
import { RecipeStats } from "./RecipeStats";
import { StageGroupRows } from "./StageGroupRows";
import { RecipeTableFilters } from "./RecipeTableFilters";

export default function RecipeFullTable({ recipe }) {
  const [quantity, setQuantity] = useState(1);
  const [showStats, setShowStats] = useState(false);
  const [filterStage, setFilterStage] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  
  useEffect(() => {
    if (recipe?.totalCost) {
      setTotalCost(recipe.totalCost * quantity);
    }
  }, [quantity, recipe]);
  
  if (!recipe) {
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
  const stages = recipe.routing_stages 
    ? [...new Set(recipe.routing_stages.map(stage => stage.name))]
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{recipe.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>
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
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Materials Section */}
              {recipe.materials && recipe.materials.length > 0 && (
                <MaterialsTableRows 
                  materials={recipe.materials} 
                  quantity={quantity} 
                />
              )}
              
              {/* Personnel Section */}
              {recipe.personnel && recipe.personnel.length > 0 && (
                <PersonnelRow 
                  personnel={recipe.personnel} 
                  quantity={quantity} 
                />
              )}
              
              {/* Machines Section */}
              {recipe.machines && recipe.machines.length > 0 && (
                <MachineRow 
                  machines={recipe.machines} 
                  quantity={quantity} 
                />
              )}
              
              {/* Routing Stages Section */}
              {recipe.routing_stages && recipe.routing_stages.length > 0 && (
                <StageGroupRows 
                  routingStages={recipe.routing_stages} 
                  quantity={quantity}
                  filterStage={filterStage}
                />
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
