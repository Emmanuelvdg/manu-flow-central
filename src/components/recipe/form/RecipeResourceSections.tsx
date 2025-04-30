
import React from "react";
import { RecipeMaterialsSection } from "../RecipeMaterialsSection";
import { RecipePersonnelSection } from "../RecipePersonnelSection";
import { RecipeMachinesSection } from "../RecipeMachinesSection";
import { RecipeRoutingStagesSection } from "../RecipeRoutingStagesSection";
import type { 
  RecipeMaterialsSectionProps, 
  RecipePersonnelSectionProps, 
  RecipeMachinesSectionProps,
  RecipeRoutingStagesSectionProps
} from "./RecipeFormTypes";

interface RecipeResourceSectionsProps {
  materialsProps: RecipeMaterialsSectionProps;
  personnelProps: RecipePersonnelSectionProps;
  machinesProps: RecipeMachinesSectionProps;
  routingStagesProps: RecipeRoutingStagesSectionProps;
}

export const RecipeResourceSections: React.FC<RecipeResourceSectionsProps> = ({
  materialsProps,
  personnelProps,
  machinesProps,
  routingStagesProps
}) => {
  return (
    <div className="pt-2">
      <RecipeMaterialsSection {...materialsProps} />
      <RecipePersonnelSection {...personnelProps} />
      <RecipeMachinesSection {...machinesProps} />
      <RecipeRoutingStagesSection {...routingStagesProps} />
    </div>
  );
};
