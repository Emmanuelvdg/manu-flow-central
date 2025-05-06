
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Clock } from "lucide-react";

interface RoutingStageRowProps {
  stageName: string;
  hours: number;
}

const RoutingStageRow: React.FC<RoutingStageRowProps> = ({ stageName, hours }) => {
  return (
    <TableRow className="bg-gray-100">
      <TableCell className="text-purple-800 font-medium">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" /> Stage
        </div>
      </TableCell>
      <TableCell className="font-medium">{stageName}</TableCell>
      <TableCell>-</TableCell>
      <TableCell className="text-center">{hours}</TableCell>
      <TableCell>hr</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
    </TableRow>
  );
};

export default RoutingStageRow;
