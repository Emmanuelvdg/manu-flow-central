
import { useState } from "react";
import { RoutingStage } from "@/components/recipe/types/recipeMappingTypes";
import { useStageExpansion } from "./hooks/useStageExpansion";
import { useStageProgress } from "./hooks/useStageProgress";
import { useRecipeData } from "./hooks/useRecipeData";

export const useRoutingStages = (orderProducts: any[], uniqueRecipeIds: string[]) => {
  const [tabValue, setTabValue] = useState("stages");
  
  // Use smaller, focused hooks
  const { expandedStages, handleToggleStage } = useStageExpansion();
  const { routingStages, loading, loadingErrorMessage, setLoadingErrorMessage } = useRecipeData(uniqueRecipeIds);
  const { stageProgress, isUpdating, handleProgressChange, handleUpdateProgress } = useStageProgress(orderProducts, tabValue);

  return {
    expandedStages,
    isUpdating,
    tabValue,
    setTabValue,
    routingStages,
    stageProgress,
    loading,
    loadingErrorMessage,
    handleToggleStage,
    handleProgressChange,
    handleUpdateProgress,
    setLoadingErrorMessage
  };
};
