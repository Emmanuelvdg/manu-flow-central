
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody
} from "@/components/ui/table";
import MaterialsTableRows from "./MaterialsTableRows";
import { PersonnelRow } from "./PersonnelRow";
import { MachineRow } from "./MachineRow";
import { StageGroupRows } from "./StageGroupRows";
import { RecipeStats } from "./RecipeStats";
import { TotalCostRow } from "./TotalCostRow";
import RecipeTableFilters from "./RecipeTableFilters";
import { RecipeFullTableProps } from "./types";

const RecipeFullTable: React.FC<RecipeFullTableProps> = ({ 
  materials, 
  routingStages,
  materialCosts,
  quantity = 1,
  setQuantity,
  onCostUpdated
}) => {
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState({
    showPersonnel: true,
    showMachines: true,
    showMaterials: true
  });

  // Calculate costs
  const calculateMaterialCost = () => {
    if (!materials) return 0;
    
    return materials.reduce((sum, material) => {
      const materialCost = materialCosts?.individualCosts?.find(m => m.id === material.id)?.costPerUnit || 0;
      return sum + (materialCost * (material.quantity || 1));
    }, 0);
  };
  
  const calculateLaborCost = () => {
    if (!routingStages) return 0;
    
    const personnel = routingStages.flatMap(stage => stage.personnel || []);
    return personnel.reduce((sum, person) => {
      const hourlyRate = person.cost_per_hour || 0;
      const hours = person.hours || 0;
      return sum + (hourlyRate * hours);
    }, 0);
  };
  
  const calculateMachineCost = () => {
    if (!routingStages) return 0;
    
    const machines = routingStages.flatMap(stage => stage.machines || []);
    return machines.reduce((sum, machine) => {
      const hourlyRate = machine.cost_per_hour || 0;
      const hours = machine.hours || 0;
      return sum + (hourlyRate * hours);
    }, 0);
  };
  
  const materialCost = calculateMaterialCost() * quantity;
  const laborCost = calculateLaborCost() * quantity;
  const machineCost = calculateMachineCost() * quantity;
  const totalCost = materialCost + laborCost + machineCost;
  
  // Update parent component with cost when it changes
  useEffect(() => {
    if (onCostUpdated) {
      onCostUpdated(totalCost);
    }
  }, [totalCost, onCostUpdated]);

  if (!materials && !routingStages) {
    return <div>No recipe data available</div>;
  }

  return (
    <div className="space-y-4">
      <RecipeStats
        quantity={quantity}
        showStats={showStats}
        setShowStats={setShowStats}
        materialCost={materialCost}
        laborCost={laborCost}
        machineCost={machineCost}
        totalCost={totalCost}
      />
      
      <RecipeTableFilters 
        showPersonnel={filters.showPersonnel}
        showMachines={filters.showMachines}
        showMaterials={filters.showMaterials}
        setFilters={setFilters}
        quantity={quantity}
        setQuantity={setQuantity}
      />

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
          {filters.showMaterials && materials && materials.length > 0 && (
            <MaterialsTableRows 
              materials={materials} 
              materialCosts={materialCosts?.individualCosts || []} 
              quantity={quantity} 
            />
          )}
          
          {filters.showPersonnel && routingStages && routingStages.length > 0 && 
            routingStages.flatMap(stage => stage.personnel || []).map(personnel => (
              <PersonnelRow 
                key={personnel.id || personnel.personnel_id} 
                personnel={personnel} 
                quantity={quantity} 
              />
            ))
          }
          
          {filters.showMachines && routingStages && routingStages.length > 0 && 
            routingStages.flatMap(stage => stage.machines || []).map(machine => (
              <MachineRow 
                key={machine.id || machine.machine_id} 
                machine={machine} 
                quantity={quantity} 
              />
            ))
          }
          
          {routingStages && routingStages.length > 0 && filters.showMachines && filters.showPersonnel && (
            <StageGroupRows 
              routingStages={routingStages}
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
