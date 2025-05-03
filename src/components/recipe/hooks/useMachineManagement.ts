
import { useState } from "react";
import type { Machine, RoutingStage } from "../types/recipeMappingTypes";

export function useMachineManagement() {
  // We no longer maintain a separate machines state since it will be
  // nested within routing stages
  const [showMachines, setShowMachines] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Partial<Machine> | null>(null);

  const handleAddMachine = (stageId: string) => {
    setEditingMachine({
      id: `temp-${Date.now()}`,
      machine: '',
      hours: 1,
      _isNew: true,
      stageId: stageId
    });
  };

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine({ ...machine });
  };

  // Updated to handle machines within stages
  const handleSaveMachine = (routingStages: RoutingStage[], setRoutingStages: React.Dispatch<React.SetStateAction<RoutingStage[]>>) => {
    if (!editingMachine || !editingMachine.machine || !editingMachine.stageId) return;
    
    const updatedMachine = {
      id: editingMachine.id || `temp-${Date.now()}`,
      machine: editingMachine.machine,
      hours: editingMachine.hours || 1,
      stageId: editingMachine.stageId
    } as Machine;
    
    const updatedStages = routingStages.map(stage => {
      if (stage.id === updatedMachine.stageId) {
        // Get the current machines array or initialize a new one
        const currentMachines = stage.machines || [];
        
        if (editingMachine._isNew) {
          // Add new machine
          return {
            ...stage,
            machines: [...currentMachines, updatedMachine]
          };
        } else {
          // Update existing machine
          return {
            ...stage,
            machines: currentMachines.map(m => 
              m.id === updatedMachine.id ? updatedMachine : m
            )
          };
        }
      }
      return stage;
    });
    
    setRoutingStages(updatedStages);
    setEditingMachine(null);
  };

  const handleDeleteMachine = (id: string, stageId: string, routingStages: RoutingStage[], setRoutingStages: React.Dispatch<React.SetStateAction<RoutingStage[]>>) => {
    const updatedStages = routingStages.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          machines: (stage.machines || []).filter(m => m.id !== id)
        };
      }
      return stage;
    });
    
    setRoutingStages(updatedStages);
  };

  return {
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
