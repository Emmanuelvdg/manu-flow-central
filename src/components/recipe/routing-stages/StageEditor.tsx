
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import type { RoutingStage } from "../types/recipeMappingTypes";

interface StageEditorProps {
  editingRoutingStage: Partial<RoutingStage>;
  routingStagesList: any[];
  handleStageIdChange: (stageId: string) => void;
  setEditingRoutingStage: (stage: Partial<RoutingStage> | null) => void;
  handleSaveRoutingStage: () => void;
  disabled?: boolean;
}

const StageEditor: React.FC<StageEditorProps> = ({
  editingRoutingStage,
  routingStagesList,
  handleStageIdChange,
  setEditingRoutingStage,
  handleSaveRoutingStage,
  disabled = false
}) => {
  return (
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
  );
};

export default StageEditor;
