
import React from "react";
import { Clock, Users, Factory } from "lucide-react";
import { 
  calculateTotalMaterialItems, 
  calculateTotalStages, 
  calculateTotalPersonnelHours,
  calculateTotalMachineHours,
  formatCurrency
} from "./utils";
import type { Material, RoutingStage } from "./types";

interface RecipeStatsProps {
  materials: Material[];
  routingStages: RoutingStage[];
  totalCost: number;
}

const RecipeStats: React.FC<RecipeStatsProps> = ({
  materials,
  routingStages,
  totalCost
}) => {
  // Calculate totals
  const totalMaterialItems = calculateTotalMaterialItems(materials);
  const totalStages = calculateTotalStages(routingStages);
  const totalPersonnelHours = calculateTotalPersonnelHours(routingStages);
  const totalMachineHours = calculateTotalMachineHours(routingStages);
  
  return (
    <div className="mb-4 grid grid-cols-5 gap-2 text-xs">
      <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
        <div className="font-medium">Materials</div>
        <div>{totalMaterialItems} items</div>
      </div>
      <div className="bg-purple-50 p-2 rounded border border-purple-200">
        <div className="font-medium">Routing Stages</div>
        <div>{totalStages} stages</div>
      </div>
      <div className="bg-green-50 p-2 rounded border border-green-200">
        <div className="font-medium flex items-center">
          <Users size={14} className="mr-1" /> Personnel
        </div>
        <div>{totalPersonnelHours} hours</div>
      </div>
      <div className="bg-blue-50 p-2 rounded border border-blue-200">
        <div className="font-medium flex items-center">
          <Factory size={14} className="mr-1" /> Machinery
        </div>
        <div>{totalMachineHours} hours</div>
      </div>
      <div className="bg-red-50 p-2 rounded border border-red-200">
        <div className="font-medium">Total COGS</div>
        <div>{formatCurrency(totalCost)}</div>
      </div>
    </div>
  );
};

export default RecipeStats;
