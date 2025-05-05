
import React from "react";
import { Clock, Users, Factory } from "lucide-react";
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
    <div className="space-y-2 text-xs text-gray-600">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-purple-600" />
        <span className="font-medium">Stage Hours:</span> {activeStage.hours}
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-600" />
        <span className="font-medium">Personnel Hours:</span> {getTotalPersonnelHours(activeStageId)}
      </div>
      <div className="flex items-center gap-2">
        <Factory className="w-4 h-4 text-green-600" />
        <span className="font-medium">Machine Hours:</span> {getTotalMachineHours(activeStageId)}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs italic text-gray-500">
          Personnel and machines are defined within this routing stage. Click the respective tabs above to manage them.
        </p>
      </div>
    </div>
  );
};

export default StageDetailsTab;
