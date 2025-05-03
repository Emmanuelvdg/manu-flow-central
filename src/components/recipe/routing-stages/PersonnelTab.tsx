
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import type { Personnel } from "../types/recipeMappingTypes";

interface PersonnelTabProps {
  stagePersonnel: Personnel[];
  activeStageId: string;
  handleEditPersonnel: (personnel: Personnel) => void;
  handleDeletePersonnel: (id: string, stageId: string) => void;
  handleAddPersonnel: (stageId: string) => void;
  disabled?: boolean;
}

const PersonnelTab: React.FC<PersonnelTabProps> = ({
  stagePersonnel,
  activeStageId,
  handleEditPersonnel,
  handleDeletePersonnel,
  handleAddPersonnel,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <table className="w-full text-xs mb-1">
        <thead>
          <tr>
            <th className="text-left py-1 px-2">Role</th>
            <th className="text-left py-1 px-2">Hours</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {stagePersonnel.map((person) => (
            <tr key={person.id}>
              <td className="px-2 py-1">{person.role}</td>
              <td className="px-2 py-1">{person.hours}</td>
              <td className="px-2 py-1 flex gap-1">
                <Button variant="ghost" size="icon" type="button" onClick={() => {
                  handleEditPersonnel({...person, stageId: activeStageId});
                }} disabled={disabled}>
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" type="button" onClick={() => handleDeletePersonnel(person.id, activeStageId)} disabled={disabled}>
                  <Trash className="w-3 h-3" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="text-xs mt-1"
        onClick={() => handleAddPersonnel(activeStageId)}
        disabled={disabled}
      >
        <Plus className="w-3 h-3 mr-1" /> Add Personnel
      </Button>
    </div>
  );
};

export default PersonnelTab;
