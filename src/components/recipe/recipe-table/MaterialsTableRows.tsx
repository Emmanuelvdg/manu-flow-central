
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "./utils";
import type { Material, MaterialCost } from "./types";

interface MaterialsTableRowsProps {
  materials: Material[];
  materialCosts: MaterialCost[];
}

const MaterialsTableRows: React.FC<MaterialsTableRowsProps> = ({
  materials,
  materialCosts = []
}) => {
  return (
    <>
      {materials.map((m) => {
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
