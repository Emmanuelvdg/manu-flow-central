
import React from "react";
import { Personnel } from "@/components/recipe/types/recipeMappingTypes";

interface StagePersonnelDisplayProps {
  personnel?: Personnel[];
}

export const StagePersonnelDisplay: React.FC<StagePersonnelDisplayProps> = ({ personnel }) => {
  if (!personnel || personnel.length === 0) {
    return (
      <p className="text-sm text-gray-500">No personnel assigned to this stage</p>
    );
  }
  
  return (
    <div className="mt-2">
      <div className="text-sm">
        <p className="font-medium">Personnel required:</p>
        <ul className="list-disc pl-5 mt-1">
          {personnel.map(person => (
            <li key={person.id}>
              {person.role} ({person.hours} hrs)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
