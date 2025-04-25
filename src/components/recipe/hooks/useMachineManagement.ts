
import { useState } from "react";
import type { Machine } from "../types/recipeMappingTypes";

export function useMachineManagement() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showMachines, setShowMachines] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Partial<Machine> | null>(null);

  const handleAddMachine = () => setEditingMachine({ id: "", machine: "", hours: 1 });
  
  const handleEditMachine = (m: Machine) => setEditingMachine({ ...m });
  
  const handleSaveMachine = () => {
    if (!editingMachine?.machine) return;
    if (editingMachine.id) {
      setMachines(arr => 
        arr.map(m => m.id === editingMachine.id ? { ...editingMachine, id: editingMachine.id } as Machine : m)
      );
    } else {
      setMachines(arr => [
        ...arr,
        { ...editingMachine, id: Date.now().toString() } as Machine
      ]);
    }
    setEditingMachine(null);
  };
  
  const handleDeleteMachine = (id: string) => setMachines(arr => arr.filter(m => m.id !== id));

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
