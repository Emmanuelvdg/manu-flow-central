
import { useState } from "react";
import type { RoutingStage } from "../types/recipeMappingTypes";

export function useRoutingStagesManagement() {
  const [routingStages, setRoutingStages] = useState<RoutingStage[]>([]);
  const [showRoutingStages, setShowRoutingStages] = useState(false);
  const [editingRoutingStage, setEditingRoutingStage] = useState<Partial<RoutingStage> | null>(null);

  const handleAddRoutingStage = () => {
    // Create a temporary ID for the new stage until it's saved
    setEditingRoutingStage({
      id: `temp-${Date.now()}`,
      stage_id: '',
      stage_name: '',
      hours: 1,
      // Using a custom property to track new entries that won't be saved to database
      // We'll remove this before saving
      _isNew: true,
    });
    setShowRoutingStages(true);
  };

  const handleEditRoutingStage = (routingStage: RoutingStage) => {
    setEditingRoutingStage({ ...routingStage });
    setShowRoutingStages(true);
  };

  const handleSaveRoutingStage = () => {
    if (!editingRoutingStage || !editingRoutingStage.stage_id) return;
    
    const updatedStage = {
      id: editingRoutingStage.id || `temp-${Date.now()}`,
      stage_id: editingRoutingStage.stage_id,
      stage_name: editingRoutingStage.stage_name || '',
      hours: editingRoutingStage.hours || 1
    } as RoutingStage;
    
    if (editingRoutingStage._isNew) {
      setRoutingStages([...routingStages, updatedStage]);
    } else {
      setRoutingStages(
        routingStages.map(s => s.id === updatedStage.id ? updatedStage : s)
      );
    }
    
    setEditingRoutingStage(null);
  };

  const handleDeleteRoutingStage = (id: string) => {
    setRoutingStages(routingStages.filter(s => s.id !== id));
  };

  return {
    routingStages,
    setRoutingStages,
    showRoutingStages,
    setShowRoutingStages,
    editingRoutingStage,
    setEditingRoutingStage,
    handleAddRoutingStage,
    handleEditRoutingStage,
    handleSaveRoutingStage,
    handleDeleteRoutingStage
  };
}
