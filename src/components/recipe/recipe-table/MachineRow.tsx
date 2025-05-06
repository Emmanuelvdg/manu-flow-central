
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Factory } from "lucide-react";
import type { Machine } from "./types";

interface MachineRowProps {
  machine: Machine;
  stageName: string;
}

const MachineRow: React.FC<MachineRowProps> = ({ machine, stageName }) => {
  return (
    <TableRow className="bg-blue-50">
      <TableCell className="text-blue-800 pl-6">
        <div className="flex items-center">
          <Factory size={14} className="mr-1" /> Machine
        </div>
      </TableCell>
      <TableCell>{stageName}</TableCell>
      <TableCell>{machine.machine}</TableCell>
      <TableCell className="text-center">{machine.hours}</TableCell>
      <TableCell>hr</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
    </TableRow>
  );
};

export default MachineRow;
