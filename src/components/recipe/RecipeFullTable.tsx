
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}
interface Personnel {
  id: string;
  role: string;
  hours: number;
}
interface Machine {
  id: string;
  machine: string;
  hours: number;
}

interface RecipeFullTableProps {
  materials: Material[];
  personnel: Personnel[];
  machines: Machine[];
}

const RecipeFullTable: React.FC<RecipeFullTableProps> = ({
  materials,
  personnel,
  machines,
}) => (
  <div className="mt-4">
    <div className="mb-2 font-semibold text-gray-700 text-sm">
      Full Recipe Table
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Name / Role / Machine</TableHead>
          <TableHead className="text-center">Qty / Hrs</TableHead>
          <TableHead>Unit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((m) => (
          <TableRow key={m.id + "_mat"}>
            <TableCell className="text-yellow-800">Material</TableCell>
            <TableCell>{m.name}</TableCell>
            <TableCell className="text-center">{m.quantity}</TableCell>
            <TableCell>{m.unit}</TableCell>
          </TableRow>
        ))}
        {personnel.map((p) => (
          <TableRow key={p.id + "_pers"}>
            <TableCell className="text-green-800">Personnel</TableCell>
            <TableCell>{p.role}</TableCell>
            <TableCell className="text-center">{p.hours}</TableCell>
            <TableCell>hr</TableCell>
          </TableRow>
        ))}
        {machines.map((m) => (
          <TableRow key={m.id + "_mach"}>
            <TableCell className="text-blue-800">Machine</TableCell>
            <TableCell>{m.machine}</TableCell>
            <TableCell className="text-center">{m.hours}</TableCell>
            <TableCell>hr</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default RecipeFullTable;
