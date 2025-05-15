
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "./utils";
import { Package2 } from "lucide-react";
import type { Material, MaterialCost } from "./types";

interface MaterialsTableRowsProps {
  materials: Material[];
  materialCosts: MaterialCost[];
  quantity: number;
  filters?: {
    materialNameFilter: string;
    minCostThreshold: number;
  };
}

const MaterialsTableRows: React.FC<MaterialsTableRowsProps> = ({
  materials,
  materialCosts = [],
  quantity = 1,
  filters = { materialNameFilter: "", minCostThreshold: 0 }
}) => {
  const filteredMaterials = materials.filter(material => {
    // Find the material cost
    const materialCost = materialCosts.find(cost => cost.id === material.id);
    const materialCostValue = materialCost?.cost || 0;
    
    // Material name filter
    const nameMatches = material.name.toLowerCase().includes(filters.materialNameFilter.toLowerCase());
    
    // Cost threshold filter
    const costAboveThreshold = materialCostValue >= filters.minCostThreshold;
    
    return nameMatches && costAboveThreshold;
  });

  if (filteredMaterials.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
          <div className="flex flex-col items-center">
            <Package2 className="h-8 w-8 text-gray-300 mb-2" />
            <span>No materials match your filter criteria</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {filteredMaterials.map((m) => {
        const materialCost = materialCosts.find(cost => cost.id === m.id);
        return (
          <TableRow key={m.id + "_mat"} className="hover:bg-yellow-50 transition-colors">
            <TableCell className="font-medium text-yellow-800">
              <div className="flex items-center">
                <Package2 size={14} className="mr-2 text-yellow-600" />
                Material
              </div>
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell className="font-medium">{m.name}</TableCell>
            <TableCell className="text-center">{m.quantity}</TableCell>
            <TableCell>{m.unit}</TableCell>
            <TableCell>{materialCost ? formatCurrency(materialCost.costPerUnit) : '-'}</TableCell>
            <TableCell className="font-semibold">{materialCost ? formatCurrency(materialCost.cost) : '-'}</TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default MaterialsTableRows;
