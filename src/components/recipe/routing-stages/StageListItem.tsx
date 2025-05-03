
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Users, Factory, Clock } from "lucide-react";
import type { RoutingStage } from "../types/recipeMappingTypes";

interface StageListItemProps {
  stage: RoutingStage;
  handleEditRoutingStage: (stage: RoutingStage) => void;
  handleDeleteRoutingStage: (id: string) => void;
  handleSelectStage: (stageId: string) => void;
  getTotalPersonnelHours: (stageId: string) => number;
  getTotalMachineHours: (stageId: string) => number;
  disabled?: boolean;
}

const StageListItem: React.FC<StageListItemProps> = ({
  stage,
  handleEditRoutingStage,
  handleDeleteRoutingStage,
  handleSelectStage,
  getTotalPersonnelHours,
  getTotalMachineHours,
  disabled = false
}) => {
  return (
    <tr onClick={() => handleSelectStage(stage.id)} className="hover:bg-gray-100 cursor-pointer">
      <td className="px-2 py-1">{stage.stage_name}</td>
      <td className="px-2 py-1">{stage.hours}</td>
      <td className="px-2 py-1">
        <div className="flex items-center">
          <span className="mr-1">{(stage.personnel || []).length}</span>
          {getTotalPersonnelHours(stage.id) > 0 && (
            <span className="text-gray-500">({getTotalPersonnelHours(stage.id)} hrs)</span>
          )}
        </div>
      </td>
      <td className="px-2 py-1">
        <div className="flex items-center">
          <span className="mr-1">{(stage.machines || []).length}</span>
          {getTotalMachineHours(stage.id) > 0 && (
            <span className="text-gray-500">({getTotalMachineHours(stage.id)} hrs)</span>
          )}
        </div>
      </td>
      <td className="px-2 py-1 flex gap-1">
        <Button variant="ghost" size="icon" type="button" onClick={(e) => {
          e.stopPropagation();
          handleEditRoutingStage(stage);
        }} disabled={disabled}>
          <Pencil className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" type="button" onClick={(e) => {
          e.stopPropagation();
          handleDeleteRoutingStage(stage.id);
        }} disabled={disabled}>
          <Trash className="w-3 h-3" />
        </Button>
      </td>
    </tr>
  );
};

export default StageListItem;
