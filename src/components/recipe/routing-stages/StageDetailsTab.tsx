
import React from "react";
import type { RoutingStage } from "../types/recipeMappingTypes";

interface StageDetailsTabProps {
  activeStageId: string;
  routingStages: RoutingStage[];
  getTotalPersonnelHours: (stageId: string) => number;
  getTotalMachineHours: (stageId: string) => number;
}

const StageDetailsTab: React.FC<StageDetailsTabProps> = ({
  activeStageId,
  routingStages,
  getTotalPersonnelHours,
  getTotalMachineHours,
}) => {
  const activeStage = routingStages.find(s => s.id === activeStageId);
  if (!activeStage) return null;

  return (
    <div className="text-xs text-gray-600">
      <p><strong>Stage Hours:</strong> {activeStage.hours}</p>
      <p><strong>Personnel Hours:</strong> {getTotalPersonnelHours(activeStageId)}</p>
      <p><strong>Machine Hours:</strong> {getTotalMachineHours(activeStageId)}</p>
    </div>
  );
};

export default StageDetailsTab;
