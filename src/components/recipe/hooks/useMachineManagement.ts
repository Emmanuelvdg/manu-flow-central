
import { useState } from "react";
import type { Machine } from "../types/recipeMappingTypes";

export function useMachineManagement() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showMachines, setShowMachines] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Partial<Machine> | null>(null);

  const handleAddMachine = () => {
    setEditingMachine({
      id: `temp-${Date.now()}`,
      machine: '',
      hours: 1,
      _isNew: true,
    });
    setShowMachines(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine({ ...machine });
    setShowMachines(true);
  };

  const handleSaveMachine = () => {
    if (!editingMachine || !editingMachine.machine) return;
    
    const updatedMachine = {
      id: editingMachine.id || `temp-${Date.now()}`,
      machine: editingMachine.machine,
      hours: editingMachine.hours || 1
    } as Machine;
    
    if (editingMachine._isNew) {
      setMachines([...machines, updatedMachine]);
    } else {
      setMachines(
        machines.map(m => m.id === updatedMachine.id ? updatedMachine : m)
      );
    }
    
    setEditingMachine(null);
  };

  const handleDeleteMachine = (id: string) => {
    setMachines(machines.filter(m => m.id !== id));
  };

  return {
    machines,
    setMachines,
    showMachines,
    setShowMachines,
    editingMachine,
    setEditingMachine,
    handleAddMachine,
    handleEditMachine,
    handleSaveMachine,
    handleDeleteMachine
  };
}
