
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RecipeStats from "./RecipeStats";
import MaterialsTableRows from "./MaterialsTableRows";
import StageGroupRows from "./StageGroupRows";
import TotalCostRow from "./TotalCostRow";
import type { RecipeFullTableProps } from "./types";

const RecipeFullTable: React.FC<RecipeFullTableProps> = ({
  materials,
  routingStages,
  materialCosts = { individualCosts: [], totalCost: 0 }
}) => {
  return (
    <div className="mt-4">
      <div className="mb-2 font-semibold text-gray-700 text-sm">
        Full Recipe Table
      </div>
      
      <RecipeStats 
        materials={materials} 
        routingStages={routingStages} 
        totalCost={materialCosts.totalCost} 
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Routing Stage</TableHead>
            <TableHead>Name / Role / Machine</TableHead>
            <TableHead className="text-center">Qty / Hrs</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Unit Cost</TableHead>
            <TableHead>Total Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <MaterialsTableRows 
            materials={materials} 
            materialCosts={materialCosts.individualCosts} 
          />
          
          {routingStages.map((stage) => (
            <StageGroupRows key={stage.id} stage={stage} />
          ))}
          
          {/* Total Cost Summary Row */}
          <TotalCostRow totalCost={materialCosts.totalCost} />
        </TableBody>
      </Table>
    </div>
  );
};

export default RecipeFullTable;
