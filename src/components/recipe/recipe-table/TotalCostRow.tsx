
import React from "react";

export interface TotalCostRowProps {
  totalCost: number;
}

export const TotalCostRow: React.FC<TotalCostRowProps> = ({ totalCost }) => {
  return (
    <tr className="border-t border-t-2 border-t-gray-300">
      <td colSpan={4} className="py-3 font-bold text-right">
        Total Recipe Cost:
      </td>
      <td className="py-3 text-right font-bold">${totalCost.toFixed(2)}</td>
    </tr>
  );
};
