
import React from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

interface RecipeButtonProps {
  onClick: () => void;
}

export const RecipeButton: React.FC<RecipeButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-start">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      >
        <ClipboardList className="h-4 w-4 mr-1" />
        BOM/Material Mapping
      </Button>
    </div>
  );
};
