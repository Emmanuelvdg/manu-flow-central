
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import type { Machine } from "../types/recipeMappingTypes";

interface MachinesTabProps {
  stageMachines: Machine[];
  activeStageId: string;
  handleEditMachine: (machine: Machine) => void;
  handleDeleteMachine: (id: string, stageId: string) => void;
  handleAddMachine: (stageId: string) => void;
  disabled?: boolean;
}

const MachinesTab: React.FC<MachinesTabProps> = ({
  stageMachines,
  activeStageId,
  handleEditMachine,
  handleDeleteMachine,
  handleAddMachine,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <table className="w-full text-xs mb-1">
        <thead>
          <tr>
            <th className="text-left py-1 px-2">Machine</th>
            <th className="text-left py-1 px-2">Hours</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {stageMachines.map((machine) => (
            <tr key={machine.id}>
              <td className="px-2 py-1">{machine.machine}</td>
              <td className="px-2 py-1">{machine.hours}</td>
              <td className="px-2 py-1 flex gap-1">
                <Button variant="ghost" size="icon" type="button" onClick={() => {
                  handleEditMachine({...machine, stageId: activeStageId});
                }} disabled={disabled}>
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" type="button" onClick={() => handleDeleteMachine(machine.id, activeStageId)} disabled={disabled}>
                  <Trash className="w-3 h-3" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="text-xs mt-1"
        onClick={() => handleAddMachine(activeStageId)}
        disabled={disabled}
      >
        <Plus className="w-3 h-3 mr-1" /> Add Machine
      </Button>
    </div>
  );
};

export default MachinesTab;
