
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
interface RoutingStage {
  id: string;
  stage_name: string;
  hours: number;
  personnel?: Personnel[];
  machines?: Machine[];
}

interface RequirementsSectionProps {
  materials: Material[];
  personnel: Personnel[];
  machines: Machine[];
  routingStages: RoutingStage[];
  onAddMaterial: () => void;
  onAddRoutingStage: () => void;
}

const RequirementsSection: React.FC<RequirementsSectionProps> = ({
  materials,
  personnel,
  machines,
  routingStages,
  onAddMaterial,
  onAddRoutingStage,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
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
    
    {/* Routing Stages */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-purple-800">Routing Stages</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddRoutingStage}
          className="h-7 px-2 py-1 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="rounded border p-2 bg-gray-50">
        {routingStages.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No routing stages defined</p>
        ) : (
          <ul>
            {routingStages.map((stage) => (
              <li key={stage.id} className="mb-2">
                <div className="flex items-center gap-2 py-1 text-xs">
                  <ColorBox color="bg-purple-400" />
                  <strong>{stage.stage_name}</strong>
                  <span className="ml-auto text-gray-500">{stage.hours} hr</span>
                </div>
                
                {/* Personnel in this stage */}
                {(stage.personnel || []).length > 0 && (
                  <div className="pl-4 border-l-2 border-gray-200 mt-1">
                    <div className="text-xs font-medium text-green-800 mb-1">Personnel</div>
                    <ul>
                      {(stage.personnel || []).map((person) => (
                        <li key={person.id} className="flex items-center gap-2 py-1 text-xs">
                          <ColorBox color="bg-green-400" />
                          <span>{person.role}</span>
                          <span className="ml-auto text-gray-500">{person.hours} hr</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Machines in this stage */}
                {(stage.machines || []).length > 0 && (
                  <div className="pl-4 border-l-2 border-gray-200 mt-1">
                    <div className="text-xs font-medium text-blue-800 mb-1">Machines</div>
                    <ul>
                      {(stage.machines || []).map((machine) => (
                        <li key={machine.id} className="flex items-center gap-2 py-1 text-xs">
                          <ColorBox color="bg-blue-400" />
                          <span>{machine.machine}</span>
                          <span className="ml-auto text-gray-500">{machine.hours} hr</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

export default RequirementsSection;
