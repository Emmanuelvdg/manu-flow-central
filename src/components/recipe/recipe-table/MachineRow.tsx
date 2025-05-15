
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Factory } from "lucide-react";
import type { Machine } from "./types";

interface MachineRowProps {
  machine: Machine;
  quantity: number;
  stageName?: string;
}

const MachineRow: React.FC<MachineRowProps> = ({ machine, quantity, stageName = "" }) => {
  return (
    <TableRow className="bg-blue-50 hover:bg-blue-100 transition-colors">
      <TableCell className="text-blue-800 pl-6">
        <div className="flex items-center">
          <Factory size={14} className="mr-2 text-blue-600" />
          Machine
        </div>
      </TableCell>
      <TableCell className="text-gray-500">{stageName}</TableCell>
      <TableCell className="font-medium">{machine.machine}</TableCell>
      <TableCell className="text-center">{machine.hours}</TableCell>
      <TableCell>hr</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
    </TableRow>
  );
};

export default MachineRow;
