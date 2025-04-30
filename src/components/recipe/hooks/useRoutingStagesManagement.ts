
import { useState } from "react";
import type { RoutingStage } from "../types/recipeMappingTypes";

export function useRoutingStagesManagement() {
  const [routingStages, setRoutingStages] = useState<RoutingStage[]>([]);
  const [showRoutingStages, setShowRoutingStages] = useState(false);
  const [editingRoutingStage, setEditingRoutingStage] = useState<Partial<RoutingStage> | null>(null);

  const handleAddRoutingStage = () => {
    setEditingRoutingStage({
      id: `temp-${Date.now()}`,
      stage_id: '',
      stage_name: '',
      hours: 1,
      isNew: true,
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
      ...editingRoutingStage,
      isNew: undefined
    } as RoutingStage;
    
    if (editingRoutingStage.isNew) {
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
