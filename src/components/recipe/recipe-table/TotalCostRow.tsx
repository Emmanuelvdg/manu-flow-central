
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "./utils";

interface TotalCostRowProps {
  totalCost: number;
}

const TotalCostRow: React.FC<TotalCostRowProps> = ({ totalCost }) => {
  if (totalCost <= 0) return null;
  
  return (
    <TableRow className="font-bold">
      <TableCell colSpan={5} className="text-right text-gray-800">Total Cost of Goods:</TableCell>
      <TableCell colSpan={2} className="text-red-700 text-lg">
        {formatCurrency(totalCost)}
      </TableCell>
    </TableRow>
  );
};

export default TotalCostRow;
