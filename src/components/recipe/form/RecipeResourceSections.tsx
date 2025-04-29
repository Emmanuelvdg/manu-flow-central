
import React from "react";
import { RecipeMaterialsSection } from "../RecipeMaterialsSection";
import { RecipePersonnelSection } from "../RecipePersonnelSection";
import { RecipeMachinesSection } from "../RecipeMachinesSection";
import type { 
  RecipeMaterialsSectionProps, 
  RecipePersonnelSectionProps, 
  RecipeMachinesSectionProps 
} from "./RecipeFormTypes";

interface RecipeResourceSectionsProps {
  materialsProps: RecipeMaterialsSectionProps;
  personnelProps: RecipePersonnelSectionProps;
  machinesProps: RecipeMachinesSectionProps;
}

export const RecipeResourceSections: React.FC<RecipeResourceSectionsProps> = ({
  materialsProps,
  personnelProps,
  machinesProps
}) => {
  return (
    <div className="pt-2">
      <RecipeMaterialsSection {...materialsProps} />
      <RecipePersonnelSection {...personnelProps} />
      <RecipeMachinesSection {...machinesProps} />
    </div>
  );
};
