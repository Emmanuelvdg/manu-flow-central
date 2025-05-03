
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
  stageId?: string;
}
interface Machine {
  id: string;
  machine: string;
  hours: number;
  stageId?: string;
}
interface RoutingStage {
  id: string;
  stage_id: string;
  stage_name: string;
  hours: number;
  personnel?: Personnel[];
  machines?: Machine[];
}

interface RecipeFullTableProps {
  materials: Material[];
  routingStages: RoutingStage[];
}

const RecipeFullTable: React.FC<RecipeFullTableProps> = ({
  materials,
  routingStages,
}) => {
  // Calculate all personnel and machines across all stages for backwards compatibility
  const allPersonnel = routingStages.flatMap(stage => stage.personnel || []);
  const allMachines = routingStages.flatMap(stage => stage.machines || []);
  
  return (
    <div className="mt-4">
      <div className="mb-2 font-semibold text-gray-700 text-sm">
        Full Recipe Table
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Routing Stage</TableHead>
            <TableHead>Name / Role / Machine</TableHead>
            <TableHead className="text-center">Qty / Hrs</TableHead>
            <TableHead>Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((m) => (
            <TableRow key={m.id + "_mat"}>
              <TableCell className="text-yellow-800">Material</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{m.name}</TableCell>
              <TableCell className="text-center">{m.quantity}</TableCell>
              <TableCell>{m.unit}</TableCell>
            </TableRow>
          ))}
          
          {routingStages.map((stage) => (
            <React.Fragment key={stage.id}>
              {/* Stage row */}
              <TableRow className="bg-gray-100">
                <TableCell className="text-purple-800">Stage</TableCell>
                <TableCell>{stage.stage_name}</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-center">{stage.hours}</TableCell>
                <TableCell>hr</TableCell>
              </TableRow>
              
              {/* Personnel for this stage */}
              {(stage.personnel || []).map((p) => (
                <TableRow key={p.id + "_pers"}>
                  <TableCell className="text-green-800">Personnel</TableCell>
                  <TableCell>{stage.stage_name}</TableCell>
                  <TableCell>{p.role}</TableCell>
                  <TableCell className="text-center">{p.hours}</TableCell>
                  <TableCell>hr</TableCell>
                </TableRow>
              ))}
              
              {/* Machines for this stage */}
              {(stage.machines || []).map((m) => (
                <TableRow key={m.id + "_mach"}>
                  <TableCell className="text-blue-800">Machine</TableCell>
                  <TableCell>{stage.stage_name}</TableCell>
                  <TableCell>{m.machine}</TableCell>
                  <TableCell className="text-center">{m.hours}</TableCell>
                  <TableCell>hr</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecipeFullTable;
