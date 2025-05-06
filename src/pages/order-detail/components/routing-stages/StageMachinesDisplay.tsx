
import React from "react";
import { Machine } from "@/components/recipe/types/recipeMappingTypes";

interface StageMachinesDisplayProps {
  machines?: Machine[];
}

export const StageMachinesDisplay: React.FC<StageMachinesDisplayProps> = ({ machines }) => {
  if (!machines || machines.length === 0) {
    return (
      <p className="text-sm text-gray-500">No machines assigned to this stage</p>
    );
  }
  
  return (
    <div className="mt-2">
      <div className="text-sm">
        <p className="font-medium">Machines required:</p>
        <ul className="list-disc pl-5 mt-1">
          {machines.map(machine => (
            <li key={machine.id}>
              {machine.machine} ({machine.hours} hrs)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
