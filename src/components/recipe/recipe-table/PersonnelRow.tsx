
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Users } from "lucide-react";
import type { Personnel } from "./types";

interface PersonnelRowProps {
  personnel: Personnel;
  stageName: string;
}

const PersonnelRow: React.FC<PersonnelRowProps> = ({ personnel, stageName }) => {
  return (
    <TableRow className="bg-green-50">
      <TableCell className="text-green-800 pl-6">
        <div className="flex items-center">
          <Users size={14} className="mr-1" /> Personnel
        </div>
      </TableCell>
      <TableCell>{stageName}</TableCell>
      <TableCell>{personnel.role}</TableCell>
      <TableCell className="text-center">{personnel.hours}</TableCell>
      <TableCell>hr</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
    </TableRow>
  );
};

export default PersonnelRow;
