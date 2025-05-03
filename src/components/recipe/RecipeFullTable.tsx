
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Users, Factory } from "lucide-react";

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
  // Calculate totals
  const totalMaterialItems = materials.length;
  const totalStages = routingStages.length;
  const totalPersonnelHours = routingStages.reduce((sum, stage) => 
    sum + (stage.personnel || []).reduce((s, p) => s + (p.hours || 0), 0), 0);
  const totalMachineHours = routingStages.reduce((sum, stage) => 
    sum + (stage.machines || []).reduce((s, m) => s + (m.hours || 0), 0), 0);
  
  return (
    <div className="mt-4">
      <div className="mb-2 font-semibold text-gray-700 text-sm">
        Full Recipe Table
      </div>
      
      <div className="mb-4 grid grid-cols-4 gap-2 text-xs">
        <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
          <div className="font-medium">Materials</div>
          <div>{totalMaterialItems} items</div>
        </div>
        <div className="bg-purple-50 p-2 rounded border border-purple-200">
          <div className="font-medium">Routing Stages</div>
          <div>{totalStages} stages</div>
        </div>
        <div className="bg-green-50 p-2 rounded border border-green-200">
          <div className="font-medium flex items-center">
            <Users size={14} className="mr-1" /> Personnel
          </div>
          <div>{totalPersonnelHours} hours</div>
        </div>
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <div className="font-medium flex items-center">
            <Factory size={14} className="mr-1" /> Machinery
          </div>
          <div>{totalMachineHours} hours</div>
        </div>
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
                <TableCell className="text-purple-800 font-medium">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" /> Stage
                  </div>
                </TableCell>
                <TableCell className="font-medium">{stage.stage_name}</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-center">{stage.hours}</TableCell>
                <TableCell>hr</TableCell>
              </TableRow>
              
              {/* Personnel for this stage */}
              {(stage.personnel || []).map((p) => (
                <TableRow key={p.id + "_pers"} className="bg-green-50">
                  <TableCell className="text-green-800 pl-6">
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" /> Personnel
                    </div>
                  </TableCell>
                  <TableCell>{stage.stage_name}</TableCell>
                  <TableCell>{p.role}</TableCell>
                  <TableCell className="text-center">{p.hours}</TableCell>
                  <TableCell>hr</TableCell>
                </TableRow>
              ))}
              
              {/* Machines for this stage */}
              {(stage.machines || []).map((m) => (
                <TableRow key={m.id + "_mach"} className="bg-blue-50">
                  <TableCell className="text-blue-800 pl-6">
                    <div className="flex items-center">
                      <Factory size={14} className="mr-1" /> Machine
                    </div>
                  </TableCell>
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
