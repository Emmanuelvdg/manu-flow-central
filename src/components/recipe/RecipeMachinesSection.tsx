
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash, Pencil } from "lucide-react";

interface Machine {
  id: string;
  machine: string;
  hours: number;
}
interface RecipeMachinesSectionProps {
  machines: Machine[];
  showMachines: boolean;
  setShowMachines: (show: boolean) => void;
  editingMachine: Partial<Machine> | null;
  setEditingMachine: (m: Partial<Machine> | null) => void;
  handleAddMachine: () => void;
  handleEditMachine: (m: Machine) => void;
  handleSaveMachine: () => void;
  handleDeleteMachine: (id: string) => void;
}
export function RecipeMachinesSection({
  machines,
  showMachines,
  setShowMachines,
  editingMachine,
  setEditingMachine,
  handleAddMachine,
  handleEditMachine,
  handleSaveMachine,
  handleDeleteMachine
}: RecipeMachinesSectionProps) {
  return (
    <div>
      <button
        type="button"
        className="flex items-center w-full mb-2"
        onClick={() => setShowMachines(!showMachines)}
      >
        <span className="font-semibold text-blue-700 pr-2">Machines ({machines.length})</span>
        <span>{showMachines ? <Minus size={16} /> : <Plus size={16} />}</span>
      </button>
      {showMachines && (
        <div className="mb-4 border rounded-lg bg-gray-50 p-2 space-y-2">
          <table className="w-full text-xs mb-1">
            <thead>
              <tr>
                <th className="text-left py-1 px-2">Machine</th>
                <th className="text-left py-1 px-2">Hours</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {machines.map((mach) => (
                <tr key={mach.id}>
                  <td className="px-2 py-1">{mach.machine}</td>
                  <td className="px-2 py-1">{mach.hours}</td>
                  <td className="px-2 py-1 flex gap-1">
                    <Button variant="ghost" size="icon" type="button" onClick={() => handleEditMachine(mach)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button" onClick={() => handleDeleteMachine(mach.id)}>
                      <Trash className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingMachine && (
            <div className="flex gap-2 items-end">
              <Input
                placeholder="Machine Name"
                value={editingMachine.machine ?? ""}
                className="text-xs"
                onChange={e => setEditingMachine(m => ({ ...m!, machine: e.target.value }))}
                autoFocus
              />
              <Input
                placeholder="Hours"
                type="number"
                min={1}
                className="w-16 text-xs"
                value={editingMachine.hours ?? 1}
                onChange={e => setEditingMachine(m => ({ ...m!, hours: Number(e.target.value) }))}
              />
              <Button variant="outline" size="sm" type="button" onClick={handleSaveMachine}>
                Save
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingMachine(null)}>
                Cancel
              </Button>
            </div>
          )}
          {!editingMachine && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="text-xs mt-1"
              onClick={handleAddMachine}
            >
              <Plus className="w-3 h-3 mr-1" /> Add Machine
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
