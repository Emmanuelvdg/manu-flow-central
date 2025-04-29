
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, X } from "lucide-react";

interface ProductHeaderProps {
  name: string;
  showDescription: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleDescription: () => void;
  onRemove: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  showDescription,
  onNameChange,
  onToggleDescription,
  onRemove
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <Input
          placeholder="Custom product name"
          value={name}
          onChange={onNameChange}
          className="font-medium"
        />
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onToggleDescription}
      >
        <FileText className="h-4 w-4 mr-1" />
        {showDescription ? "Hide" : "Add"} Description
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-red-500"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
        Remove
      </Button>
    </div>
  );
};
