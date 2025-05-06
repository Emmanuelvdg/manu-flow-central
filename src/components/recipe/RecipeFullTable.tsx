
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

interface MaterialCost {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  costPerUnit: number;
}

interface RecipeFullTableProps {
  materials: Material[];
  routingStages: RoutingStage[];
  materialCosts?: {
    individualCosts: MaterialCost[];
    totalCost: number;
  };
}

const RecipeFullTable: React.FC<RecipeFullTableProps> = ({
  materials,
  routingStages,
  materialCosts = { individualCosts: [], totalCost: 0 }
}) => {
  // Calculate totals
  const totalMaterialItems = materials.length;
  const totalStages = routingStages.length;
  const totalPersonnelHours = routingStages.reduce((sum, stage) => 
    sum + (stage.personnel || []).reduce((s, p) => s + (p.hours || 0), 0), 0);
  const totalMachineHours = routingStages.reduce((sum, stage) => 
    sum + (stage.machines || []).reduce((s, m) => s + (m.hours || 0), 0), 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="mt-4">
      <div className="mb-2 font-semibold text-gray-700 text-sm">
        Full Recipe Table
      </div>
      
      <div className="mb-4 grid grid-cols-5 gap-2 text-xs">
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
        <div className="bg-red-50 p-2 rounded border border-red-200">
          <div className="font-medium">Total COGS</div>
          <div>{formatCurrency(materialCosts.totalCost)}</div>
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
            <TableHead>Unit Cost</TableHead>
            <TableHead>Total Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((m) => {
            const materialCost = materialCosts.individualCosts.find(cost => cost.id === m.id);
            return (
              <TableRow key={m.id + "_mat"}>
                <TableCell className="text-yellow-800">Material</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{m.name}</TableCell>
                <TableCell className="text-center">{m.quantity}</TableCell>
                <TableCell>{m.unit}</TableCell>
                <TableCell>{materialCost ? formatCurrency(materialCost.costPerUnit) : '-'}</TableCell>
                <TableCell>{materialCost ? formatCurrency(materialCost.cost) : '-'}</TableCell>
              </TableRow>
            );
          })}
          
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
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
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
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
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
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
          
          {/* Total Cost Summary Row */}
          {materialCosts.totalCost > 0 && (
            <TableRow className="bg-red-50 font-medium">
              <TableCell colSpan={5} className="text-right">Total COGS:</TableCell>
              <TableCell colSpan={2}>{formatCurrency(materialCosts.totalCost)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecipeFullTable;
