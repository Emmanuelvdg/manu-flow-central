
import React from "react";
import { Clock, Users, Factory, Package2 } from "lucide-react";
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
  showStats: boolean;
  setShowStats: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecipeStats: React.FC<RecipeStatsProps> = ({
  materials,
  routingStages,
  totalCost,
  showStats,
  setShowStats
}) => {
  // Calculate totals
  const totalMaterialItems = calculateTotalMaterialItems(materials);
  const totalStages = calculateTotalStages(routingStages);
  const totalPersonnelHours = calculateTotalPersonnelHours(routingStages);
  const totalMachineHours = calculateTotalMachineHours(routingStages);
  
  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center mb-2">
          <Package2 size={18} className="mr-2 text-yellow-700" />
          <h3 className="font-medium text-yellow-800">Materials</h3>
        </div>
        <div className="text-2xl font-semibold text-yellow-900">{totalMaterialItems}</div>
        <div className="text-xs text-yellow-700 mt-1">total items</div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center mb-2">
          <Clock size={18} className="mr-2 text-purple-700" />
          <h3 className="font-medium text-purple-800">Routing Stages</h3>
        </div>
        <div className="text-2xl font-semibold text-purple-900">{totalStages}</div>
        <div className="text-xs text-purple-700 mt-1">total stages</div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center mb-2">
          <Users size={18} className="mr-2 text-green-700" />
          <h3 className="font-medium text-green-800">Personnel</h3>
        </div>
        <div className="text-2xl font-semibold text-green-900">{totalPersonnelHours}</div>
        <div className="text-xs text-green-700 mt-1">total hours</div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center mb-2">
          <Factory size={18} className="mr-2 text-blue-700" />
          <h3 className="font-medium text-blue-800">Machinery</h3>
        </div>
        <div className="text-2xl font-semibold text-blue-900">{totalMachineHours}</div>
        <div className="text-xs text-blue-700 mt-1">total hours</div>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center mb-2">
          <h3 className="font-medium text-red-800">Total COGS</h3>
        </div>
        <div className="text-2xl font-semibold text-red-900">{formatCurrency(totalCost)}</div>
        <div className="text-xs text-red-700 mt-1">cost of goods sold</div>
      </div>
    </div>
  );
};

export default RecipeStats;
