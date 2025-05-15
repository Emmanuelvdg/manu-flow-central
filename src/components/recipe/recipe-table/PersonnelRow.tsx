
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Users } from "lucide-react";
import type { Personnel } from "./types";

interface PersonnelRowProps {
  personnel: Personnel;
  quantity: number;
  stageName?: string;
}

const PersonnelRow: React.FC<PersonnelRowProps> = ({ personnel, quantity, stageName = "" }) => {
  return (
    <TableRow className="bg-green-50 hover:bg-green-100 transition-colors">
      <TableCell className="text-green-800 pl-6">
        <div className="flex items-center">
          <Users size={14} className="mr-2 text-green-600" />
          Personnel
        </div>
      </TableCell>
      <TableCell className="text-gray-500">{stageName}</TableCell>
      <TableCell className="font-medium">{personnel.role}</TableCell>
      <TableCell className="text-center">{personnel.hours}</TableCell>
      <TableCell>hr</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
    </TableRow>
  );
};

export default PersonnelRow;
