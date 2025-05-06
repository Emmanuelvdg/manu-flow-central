
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "./utils";

interface TotalCostRowProps {
  totalCost: number;
}

const TotalCostRow: React.FC<TotalCostRowProps> = ({ totalCost }) => {
  if (totalCost <= 0) return null;
  
  return (
    <TableRow className="bg-red-50 font-medium">
      <TableCell colSpan={5} className="text-right">Total COGS:</TableCell>
      <TableCell colSpan={2}>{formatCurrency(totalCost)}</TableCell>
    </TableRow>
  );
};

export default TotalCostRow;
