import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Save } from "lucide-react";
import { StageProgressData } from "./hooks/useUnitProgress";

interface UnitProgressInputProps {
  stageProgress: StageProgressData;
  isUpdating: boolean;
  onUpdateProgress: (stageProgressId: string, updates: Partial<Pick<StageProgressData, 'yet_to_start_units' | 'in_progress_units' | 'completed_units'>>) => Promise<void>;
}

export const UnitProgressInput: React.FC<UnitProgressInputProps> = ({
  stageProgress,
  isUpdating,
  onUpdateProgress
}) => {
  const [localProgress, setLocalProgress] = useState({
    yet_to_start_units: stageProgress.yet_to_start_units,
    in_progress_units: stageProgress.in_progress_units,
    completed_units: stageProgress.completed_units,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalProgress({
      yet_to_start_units: stageProgress.yet_to_start_units,
      in_progress_units: stageProgress.in_progress_units,
      completed_units: stageProgress.completed_units,
    });
    setHasChanges(false);
  }, [stageProgress]);

  // Check if current values are different from original
  useEffect(() => {
    const changed = 
      localProgress.yet_to_start_units !== stageProgress.yet_to_start_units ||
      localProgress.in_progress_units !== stageProgress.in_progress_units ||
      localProgress.completed_units !== stageProgress.completed_units;
    setHasChanges(changed);
  }, [localProgress, stageProgress]);

  const updateField = (field: keyof typeof localProgress, value: number) => {
    const newValue = Math.max(0, value);
    const newProgress = { ...localProgress, [field]: newValue };
    
    // Auto-calculate yet_to_start based on other values
    if (field !== 'yet_to_start_units') {
      const remainingUnits = stageProgress.total_units - newProgress.in_progress_units - newProgress.completed_units;
      newProgress.yet_to_start_units = Math.max(0, remainingUnits);
    }
    
    // Validate total doesn't exceed limit
    const total = newProgress.yet_to_start_units + newProgress.in_progress_units + newProgress.completed_units;
    if (total <= stageProgress.total_units) {
      setLocalProgress(newProgress);
    }
  };

  const handleSave = async () => {
    await onUpdateProgress(stageProgress.id, localProgress);
  };

  const increment = (field: keyof typeof localProgress) => {
    updateField(field, localProgress[field] + 1);
  };

  const decrement = (field: keyof typeof localProgress) => {
    updateField(field, localProgress[field] - 1);
  };

  const handleInputChange = (field: keyof typeof localProgress, value: string) => {
    const numValue = parseInt(value) || 0;
    updateField(field, numValue);
  };

  const currentTotal = localProgress.yet_to_start_units + localProgress.in_progress_units + localProgress.completed_units;
  const isValid = currentTotal <= stageProgress.total_units;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">{stageProgress.stage_name}</h4>
        <span className="text-sm text-muted-foreground">
          Total: {stageProgress.total_units} units
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Yet to Start */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Yet to Start</Label>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => decrement('yet_to_start_units')}
              disabled={localProgress.yet_to_start_units === 0 || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={localProgress.yet_to_start_units}
              onChange={(e) => handleInputChange('yet_to_start_units', e.target.value)}
              className="text-center h-8"
              min={0}
              max={stageProgress.total_units}
              disabled={isUpdating}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => increment('yet_to_start_units')}
              disabled={currentTotal >= stageProgress.total_units || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* In Progress */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">In Progress</Label>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => decrement('in_progress_units')}
              disabled={localProgress.in_progress_units === 0 || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={localProgress.in_progress_units}
              onChange={(e) => handleInputChange('in_progress_units', e.target.value)}
              className="text-center h-8"
              min={0}
              max={stageProgress.total_units}
              disabled={isUpdating}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => increment('in_progress_units')}
              disabled={currentTotal >= stageProgress.total_units || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Completed */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Completed</Label>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => decrement('completed_units')}
              disabled={localProgress.completed_units === 0 || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={localProgress.completed_units}
              onChange={(e) => handleInputChange('completed_units', e.target.value)}
              className="text-center h-8"
              min={0}
              max={stageProgress.total_units}
              disabled={isUpdating}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => increment('completed_units')}
              disabled={currentTotal >= stageProgress.total_units || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Validation and Save */}
      <div className="flex justify-between items-center pt-2 border-t">
        <div className="text-sm">
          {!isValid && (
            <span className="text-destructive">
              Total exceeds limit ({currentTotal}/{stageProgress.total_units})
            </span>
          )}
          {isValid && currentTotal < stageProgress.total_units && (
            <span className="text-muted-foreground">
              {stageProgress.total_units - currentTotal} units unassigned
            </span>
          )}
          {isValid && currentTotal === stageProgress.total_units && (
            <span className="text-success">All units assigned</span>
          )}
        </div>
        
        <Button
          onClick={handleSave}
          disabled={!hasChanges || !isValid || isUpdating}
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isUpdating ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};