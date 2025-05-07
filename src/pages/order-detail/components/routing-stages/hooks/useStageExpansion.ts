
import { useState } from "react";

/**
 * Manages the expansion state of stage collapsibles
 */
export const useStageExpansion = () => {
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});

  const handleToggleStage = (recipeId: string, stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [`${recipeId}-${stageId}`]: !prev[`${recipeId}-${stageId}`]
    }));
  };

  return {
    expandedStages,
    handleToggleStage
  };
};
