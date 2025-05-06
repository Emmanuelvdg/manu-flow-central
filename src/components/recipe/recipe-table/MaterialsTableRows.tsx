
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "./utils";
import type { Material, MaterialCost } from "./types";
import { RecipeFilters } from "./RecipeTableFilters";

interface MaterialsTableRowsProps {
  materials: Material[];
  materialCosts: MaterialCost[];
  filters?: RecipeFilters;
}

const MaterialsTableRows: React.FC<MaterialsTableRowsProps> = ({
  materials,
  materialCosts = [],
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
        <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
          No materials match your filter criteria
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {filteredMaterials.map((m) => {
        const materialCost = materialCosts.find(cost => cost.id === m.id);
        return (
          <TableRow key={m.id + "_mat"}>
            <TableCell className="text-yellow-800">Material</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{m.name}</TableCell>
            <TableCell className="text-center">{m.quantity}</TableCell>
            <TableCell>{m.unit}</TableCell>
            <TableCell>{materialCost ? formatCurrency(materialCost.costPerUnit) : '-'}</TableCell>
            <TableCell>{materialCost ? formatCurrency(materialCost.cost) : '-'}</TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default MaterialsTableRows;
