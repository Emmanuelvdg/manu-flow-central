
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody
} from "@/components/ui/table";
import MaterialsTableRows from "./MaterialsTableRows";
import PersonnelRow from "./PersonnelRow";
import MachineRow from "./MachineRow";
import StageGroupRows from "./StageGroupRows";
import RecipeStats from "./RecipeStats";
import TotalCostRow from "./TotalCostRow";
import RecipeTableFilters from "./RecipeTableFilters";
import { RecipeFullTableProps, MaterialCost } from "./types";

const RecipeFullTable: React.FC<RecipeFullTableProps> = ({ 
  recipe, 
  quantity = 1,
  setQuantity,
  materialCosts,
  onCostUpdated
}) => {
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState({
    showPersonnel: true,
    showMachines: true,
    showMaterials: true
  });

  // Calculate costs
  const calculateTotalCost = () => {
    if (!recipe) return 0;
    
    let totalCost = 0;
    
    // Material costs
    if (recipe.materials && recipe.materials.length > 0) {
      totalCost += recipe.materials.reduce((sum, material) => {
        const materialCost = materialCosts?.[material.material_id]?.costPerUnit || 0;
        return sum + (materialCost * (material.quantity || 1));
      }, 0);
    }
    
    // Personnel costs
    if (recipe.personnel && recipe.personnel.length > 0) {
      totalCost += recipe.personnel.reduce((sum, person) => {
        const hourlyRate = person.cost_per_hour || 0; // Updated to use cost_per_hour
        const hours = person.hours || 0;
        return sum + (hourlyRate * hours);
      }, 0);
    }
    
    // Machine costs
    if (recipe.machines && recipe.machines.length > 0) {
      totalCost += recipe.machines.reduce((sum, machine) => {
        const hourlyRate = machine.cost_per_hour || 0; // Updated to use cost_per_hour
        const hours = machine.hours || 0;
        return sum + (hourlyRate * hours);
      }, 0);
    }
    
    return totalCost;
  };
  
  const totalCost = calculateTotalCost() * quantity;
  
  // Update parent component with cost when it changes
  React.useEffect(() => {
    if (onCostUpdated) {
      onCostUpdated(totalCost);
    }
  }, [totalCost, onCostUpdated]);

  if (!recipe) {
    return <div>No recipe data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <RecipeStats 
          recipeData={recipe} 
          quantity={quantity} 
          showStats={showStats} 
          setShowStats={setShowStats}
        />
        
        <RecipeTableFilters 
          filters={filters}
          setFilters={setFilters}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Description</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Cost</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filters.showMaterials && recipe.materials && recipe.materials.length > 0 && (
            <MaterialsTableRows 
              materials={recipe.materials} 
              materialCosts={materialCosts} 
              quantity={quantity} 
            />
          )}
          
          {filters.showPersonnel && recipe.personnel && recipe.personnel.length > 0 && 
            recipe.personnel.map(person => (
              <PersonnelRow 
                key={person.id || person.personnel_id} 
                person={person} 
                quantity={quantity} 
              />
            ))
          }
          
          {filters.showMachines && recipe.machines && recipe.machines.length > 0 && 
            recipe.machines.map(machine => (
              <MachineRow 
                key={machine.id || machine.machine_id} 
                machine={machine} 
                quantity={quantity} 
              />
            ))
          }
          
          {recipe.stages && recipe.stages.length > 0 && filters.showMachines && filters.showPersonnel && (
            <StageGroupRows 
              stages={recipe.stages}
              personnel={recipe.personnel || []}
              machines={recipe.machines || []}
              quantity={quantity}
            />
          )}
          
          <TotalCostRow totalCost={totalCost} />
        </TableBody>
      </Table>
    </div>
  );
};

export default RecipeFullTable;
