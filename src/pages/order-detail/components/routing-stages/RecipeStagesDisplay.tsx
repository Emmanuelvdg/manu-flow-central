
import React from "react";
import { StageCollapsible } from "./StageCollapsible";
import { RoutingStage } from "@/components/recipe/types/recipeMappingTypes";

interface RecipeStagesDisplayProps {
  recipeId: string;
  stages: RoutingStage[];
  orderProduct: any;
  expandedStages: Record<string, boolean>;
  isUpdating: Record<string, boolean>;
  stageProgress: Record<string, Record<string, number>>;
  tabValue: string;
  productName: string;
  handleToggleStage: (recipeId: string, stageId: string) => void;
  handleProgressChange: (recipeId: string, stageId: string, progressType: 'materials' | 'personnel' | 'machines', value: number) => void;
  handleUpdateProgress: (recipeId: string, stageId: string, orderProductId: string) => Promise<void>;
}

export const RecipeStagesDisplay: React.FC<RecipeStagesDisplayProps> = ({
  recipeId,
  stages,
  orderProduct,
  expandedStages,
  isUpdating,
  stageProgress,
  tabValue,
  productName,
  handleToggleStage,
  handleProgressChange,
  handleUpdateProgress
}) => {
  if (!stages || !orderProduct) return null;
  
  return (
    <div key={recipeId} className="mb-6 border rounded-md p-4">
      <h3 className="text-lg font-medium mb-2">{productName}</h3>
      
      {stages.length === 0 ? (
        <p className="text-muted-foreground text-sm">No routing stages defined for this recipe.</p>
      ) : (
        stages.map(stage => (
          <StageCollapsible
            key={stage.id}
            stage={stage}
            recipeId={recipeId}
            orderProduct={orderProduct}
            expandedStages={expandedStages}
            isUpdating={isUpdating}
            stageProgress={stageProgress}
            tabValue={tabValue}
            handleToggleStage={handleToggleStage}
            handleProgressChange={handleProgressChange}
            handleUpdateProgress={handleUpdateProgress}
          />
        ))
      )}
    </div>
  );
};
