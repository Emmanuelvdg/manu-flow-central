
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash, Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RecipeRoutingStagesSectionProps } from "./form/RecipeFormTypes";

export const RecipeRoutingStagesSection: React.FC<RecipeRoutingStagesSectionProps> = ({
  routingStages,
  routingStagesList,
  showRoutingStages,
  setShowRoutingStages,
  editingRoutingStage,
  setEditingRoutingStage,
  handleAddRoutingStage,
  handleEditRoutingStage,
  handleSaveRoutingStage,
  handleDeleteRoutingStage,
  disabled = false
}) => {
  // Handle stage ID change
  const handleStageIdChange = (stageId: string) => {
    if (!editingRoutingStage) return;
    
    const selectedStage = routingStagesList.find(stage => stage.id === stageId);
    if (selectedStage) {
      setEditingRoutingStage({ 
        ...editingRoutingStage, 
        stage_id: stageId,
        stage_name: selectedStage.stage_name 
      });
    }
  };

  return (
    <div>
      <button
        type="button"
        className="flex items-center w-full mb-2"
        onClick={() => setShowRoutingStages(!showRoutingStages)}
        disabled={disabled}
      >
        <span className="font-semibold text-purple-700 pr-2">Routing Stages ({routingStages.length})</span>
        <span>{showRoutingStages ? <Minus size={16} /> : <Plus size={16} />}</span>
      </button>
      {showRoutingStages && (
        <div className="mb-4 border rounded-lg bg-gray-50 p-2 space-y-2">
          <table className="w-full text-xs mb-1">
            <thead>
              <tr>
                <th className="text-left py-1 px-2">Stage</th>
                <th className="text-left py-1 px-2">Hours</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {routingStages.map((stage) => (
                <tr key={stage.id}>
                  <td className="px-2 py-1">{stage.stage_name}</td>
                  <td className="px-2 py-1">{stage.hours}</td>
                  <td className="px-2 py-1 flex gap-1">
                    <Button variant="ghost" size="icon" type="button" onClick={() => handleEditRoutingStage(stage)} disabled={disabled}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button" onClick={() => handleDeleteRoutingStage(stage.id)} disabled={disabled}>
                      <Trash className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingRoutingStage && (
            <div className="flex gap-2 items-end">
              <Select
                value={editingRoutingStage.stage_id || ""}
                onValueChange={handleStageIdChange}
                disabled={disabled}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {routingStagesList.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.stage_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Hours"
                type="number"
                min={0.1}
                step={0.1}
                className="w-16 text-xs"
                value={editingRoutingStage.hours ?? 1}
                onChange={e => setEditingRoutingStage({ ...editingRoutingStage, hours: Number(e.target.value) })}
                disabled={disabled}
              />
              <Button variant="outline" size="sm" type="button" onClick={handleSaveRoutingStage} disabled={disabled}>
                Save
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingRoutingStage(null)} disabled={disabled}>
                Cancel
              </Button>
            </div>
          )}
          {!editingRoutingStage && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="text-xs mt-1"
              onClick={handleAddRoutingStage}
              disabled={disabled}
            >
              <Plus className="w-3 h-3 mr-1" /> Add Routing Stage
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
