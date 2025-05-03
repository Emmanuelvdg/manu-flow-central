
import React from "react";
import StageListItem from "./StageListItem";
import { Clock, Users, Factory } from "lucide-react";
import type { RoutingStage } from "../types/recipeMappingTypes";

interface StageListProps {
  routingStages: RoutingStage[];
  handleEditRoutingStage: (stage: RoutingStage) => void;
  handleDeleteRoutingStage: (id: string) => void;
  handleSelectStage: (stageId: string) => void;
  getTotalPersonnelHours: (stageId: string) => number;
  getTotalMachineHours: (stageId: string) => number;
  disabled?: boolean;
}

const StageList: React.FC<StageListProps> = ({
  routingStages,
  handleEditRoutingStage,
  handleDeleteRoutingStage,
  handleSelectStage,
  getTotalPersonnelHours,
  getTotalMachineHours,
  disabled = false
}) => {
  return (
    <table className="w-full text-xs mb-1">
      <thead>
        <tr>
          <th className="text-left py-1 px-2">Stage</th>
          <th className="text-left py-1 px-2">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              Hours
            </div>
          </th>
          <th className="text-left py-1 px-2">
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              Personnel
            </div>
          </th>
          <th className="text-left py-1 px-2">
            <div className="flex items-center">
              <Factory size={14} className="mr-1" />
              Machines
            </div>
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {routingStages.map((stage) => (
          <StageListItem 
            key={stage.id}
            stage={stage}
            handleEditRoutingStage={handleEditRoutingStage}
            handleDeleteRoutingStage={handleDeleteRoutingStage}
            handleSelectStage={handleSelectStage}
            getTotalPersonnelHours={getTotalPersonnelHours}
            getTotalMachineHours={getTotalMachineHours}
            disabled={disabled}
          />
        ))}
      </tbody>
    </table>
  );
};

export default StageList;
