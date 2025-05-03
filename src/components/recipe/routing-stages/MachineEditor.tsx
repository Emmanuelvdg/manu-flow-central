
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Machine } from "../types/recipeMappingTypes";

interface MachineEditorProps {
  editingMachine: Partial<Machine>;
  setEditingMachine: (machine: Partial<Machine> | null) => void;
  handleSaveMachine: () => void;
  disabled?: boolean;
}

const MachineEditor: React.FC<MachineEditorProps> = ({
  editingMachine,
  setEditingMachine,
  handleSaveMachine,
  disabled = false
}) => {
  return (
    <div className="flex gap-2 items-end border-t pt-2 mt-2">
      <Input
        placeholder="Machine Name"
        value={editingMachine.machine ?? ""}
        className="text-xs"
        onChange={e => setEditingMachine({ ...editingMachine, machine: e.target.value })}
        autoFocus
        disabled={disabled}
      />
      <Input
        placeholder="Hours"
        type="number"
        min={0.1}
        step={0.1}
        className="w-16 text-xs"
        value={editingMachine.hours ?? 1}
        onChange={e => setEditingMachine({ ...editingMachine, hours: Number(e.target.value) })}
        disabled={disabled}
      />
      <Button variant="outline" size="sm" type="button" onClick={handleSaveMachine} disabled={disabled}>
        Save
      </Button>
      <Button variant="ghost" size="sm" type="button" onClick={() => setEditingMachine(null)} disabled={disabled}>
        Cancel
      </Button>
    </div>
  );
};

export default MachineEditor;
