
import { useState } from "react";
import type { Personnel, RoutingStage } from "../types/recipeMappingTypes";

export function usePersonnelManagement() {
  // We no longer maintain a separate personnel state since it will be
  // nested within routing stages
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Partial<Personnel> | null>(null);

  const handleAddPersonnel = (stageId: string) => {
    setEditingPersonnel({
      id: `temp-${Date.now()}`,
      role: '',
      hours: 1,
      _isNew: true,
      stageId: stageId
    });
  };

  const handleEditPersonnel = (person: Personnel) => {
    setEditingPersonnel({ ...person });
  };

  // Updated to handle personnel within stages
  const handleSavePersonnel = (routingStages: RoutingStage[], setRoutingStages: React.Dispatch<React.SetStateAction<RoutingStage[]>>) => {
    if (!editingPersonnel || !editingPersonnel.role || !editingPersonnel.stageId) return;
    
    const updatedPersonnel = {
      id: editingPersonnel.id || `temp-${Date.now()}`,
      role: editingPersonnel.role,
      hours: editingPersonnel.hours || 1,
      stageId: editingPersonnel.stageId
    } as Personnel;
    
    const updatedStages = routingStages.map(stage => {
      if (stage.id === updatedPersonnel.stageId) {
        // Get the current personnel array or initialize a new one
        const currentPersonnel = stage.personnel || [];
        
        if (editingPersonnel._isNew) {
          // Add new personnel
          return {
            ...stage,
            personnel: [...currentPersonnel, updatedPersonnel]
          };
        } else {
          // Update existing personnel
          return {
            ...stage,
            personnel: currentPersonnel.map(p => 
              p.id === updatedPersonnel.id ? updatedPersonnel : p
            )
          };
        }
      }
      return stage;
    });
    
    setRoutingStages(updatedStages);
    setEditingPersonnel(null);
  };

  const handleDeletePersonnel = (id: string, stageId: string, routingStages: RoutingStage[], setRoutingStages: React.Dispatch<React.SetStateAction<RoutingStage[]>>) => {
    const updatedStages = routingStages.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          personnel: (stage.personnel || []).filter(p => p.id !== id)
        };
      }
      return stage;
    });
    
    setRoutingStages(updatedStages);
  };

  return {
    showPersonnel,
    setShowPersonnel,
    editingPersonnel,
    setEditingPersonnel,
    handleAddPersonnel,
    handleEditPersonnel,
    handleSavePersonnel,
    handleDeletePersonnel
  };
}
