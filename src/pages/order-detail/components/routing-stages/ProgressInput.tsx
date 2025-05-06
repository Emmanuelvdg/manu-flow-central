
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProgressInputProps {
  recipeId: string;
  stageId: string;
  orderProductId: string;
  progress: number;
  progressType: 'materials' | 'personnel' | 'machines';
  isUpdating: boolean;
  onProgressChange: (recipeId: string, stageId: string, progressType: string, value: number) => void;
  onUpdateProgress: (recipeId: string, stageId: string, orderProductId: string) => Promise<void>;
}

export const ProgressInput: React.FC<ProgressInputProps> = ({
  recipeId,
  stageId,
  orderProductId,
  progress,
  progressType,
  isUpdating,
  onProgressChange,
  onUpdateProgress
}) => {
  const incrementProgress = () => {
    const newValue = Math.min(progress + 5, 100);
    onProgressChange(recipeId, stageId, progressType, newValue);
  };
  
  const decrementProgress = () => {
    const newValue = Math.max(progress - 5, 0);
    onProgressChange(recipeId, stageId, progressType, newValue);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col space-y-1 w-full">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <div className="flex flex-col space-y-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="px-2 py-0 h-6" 
          onClick={incrementProgress}
          disabled={progress === 100 || isUpdating}
        >
          +
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="px-2 py-0 h-6" 
          onClick={decrementProgress}
          disabled={progress === 0 || isUpdating}
        >
          -
        </Button>
      </div>
      <Button 
        size="sm" 
        onClick={() => onUpdateProgress(recipeId, stageId, orderProductId)}
        disabled={isUpdating}
        className="h-full"
      >
        {isUpdating ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};
