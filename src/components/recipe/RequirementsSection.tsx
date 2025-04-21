
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ColorBox from "./colorBox";

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

interface RequirementsSectionProps {
  materials: Material[];
  personnel: Personnel[];
  machines: Machine[];
  onAddMaterial: () => void;
  onAddPersonnel: () => void;
  onAddMachine: () => void;
}

const RequirementsSection: React.FC<RequirementsSectionProps> = ({
  materials,
  personnel,
  machines,
  onAddMaterial,
  onAddPersonnel,
  onAddMachine,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
    {/* Materials */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-indigo-800">Materials</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddMaterial}
          className="h-7 px-2 py-1 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="rounded border p-2 bg-gray-50">
        <ul>
          {materials.map((mat) => (
            <li key={mat.id} className="flex items-center gap-2 py-1 text-xs">
              <ColorBox color="bg-yellow-400" />
              <strong>{mat.name}</strong>
              <span className="ml-auto text-gray-500">
                {mat.quantity} {mat.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    {/* Personnel */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-green-800">Personnel</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddPersonnel}
          className="h-7 px-2 py-1 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="rounded border p-2 bg-gray-50">
        <ul>
          {personnel.map((person) => (
            <li key={person.id} className="flex items-center gap-2 py-1 text-xs">
              <ColorBox color="bg-green-400" />
              <strong>{person.role}</strong>
              <span className="ml-auto text-gray-500">{person.hours} hr</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    {/* Machines */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-blue-800">Machines</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddMachine}
          className="h-7 px-2 py-1 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="rounded border p-2 bg-gray-50">
        <ul>
          {machines.map((mach) => (
            <li key={mach.id} className="flex items-center gap-2 py-1 text-xs">
              <ColorBox color="bg-blue-400" />
              <strong>{mach.machine}</strong>
              <span className="ml-auto text-gray-500">{mach.hours} hr</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default RequirementsSection;
