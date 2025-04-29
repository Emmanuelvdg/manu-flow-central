
import React from "react";
import { Input } from "@/components/ui/input";
import { RecipeBasicInfoProps } from "./RecipeFormTypes";

export const RecipeBasicInfoSection: React.FC<RecipeBasicInfoProps> = ({
  name,
  description,
  setName,
  setDescription,
  disabled = false
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Recipe Name<span className="text-red-500">*</span></label>
        <Input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          disabled={disabled}
        />
      </div>
    </>
  );
};
