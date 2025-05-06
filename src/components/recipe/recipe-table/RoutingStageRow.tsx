
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

interface RoutingStageRowProps {
  stageName: string;
  hours: number;
  expandable?: boolean;
  expanded?: boolean;
}

const RoutingStageRow: React.FC<RoutingStageRowProps> = ({ 
  stageName, 
  hours,
  expandable = false,
  expanded = false 
}) => {
  return (
    <TableRow className="bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
      <TableCell className="text-purple-800 font-medium">
        <div className="flex items-center">
          <Clock size={14} className="mr-2 text-purple-600" />
          Stage
        </div>
      </TableCell>
      <TableCell className="font-medium">{stageName}</TableCell>
      <TableCell className="text-gray-500">
        {expandable && (
          <div className="flex justify-end">
            {expanded ? (
              <ChevronUp size={16} className="text-purple-600" />
            ) : (
              <ChevronDown size={16} className="text-purple-600" />
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="text-center">{hours}</TableCell>
      <TableCell>hr</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
    </TableRow>
  );
};

export default RoutingStageRow;
