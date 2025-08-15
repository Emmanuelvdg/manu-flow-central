
import { useState } from "react";
import { RoutingStage } from "@/components/recipe/types/recipeMappingTypes";
import { useStageExpansion } from "./hooks/useStageExpansion";
import { useStageProgress } from "./hooks/useStageProgress";
import { useRecipeData } from "./hooks/useRecipeData";

export const useRoutingStages = (orderProducts: any[], uniqueRecipeIds: string[]) => {
  const [tabValue, setTabValue] = useState("overview");
  
  // Use smaller, focused hooks
  const { expandedStages, handleToggleStage } = useStageExpansion();
  const { routingStages, loading, loadingErrorMessage, setLoadingErrorMessage } = useRecipeData(uniqueRecipeIds);

  return {
    expandedStages,
    tabValue,
    setTabValue,
    routingStages,
    loading,
    loadingErrorMessage,
    handleToggleStage,
    setLoadingErrorMessage
  };
};
