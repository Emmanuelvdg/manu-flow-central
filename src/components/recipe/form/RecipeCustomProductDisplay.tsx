
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecipeProductDisplayProps } from "./RecipeFormTypes";

export const RecipeCustomProductDisplay: React.FC<RecipeProductDisplayProps> = ({ customProduct }) => {
  if (!customProduct) return null;
  
  return (
    <div>
      <Label className="block text-sm font-medium mb-1">Product<span className="text-red-500">*</span></Label>
      <Input 
        value={customProduct.name} 
        disabled
        className="bg-gray-100"
      />
      <input type="hidden" value={customProduct.id || ''} />
    </div>
  );
};
