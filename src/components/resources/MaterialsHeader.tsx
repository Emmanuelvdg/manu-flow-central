
import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Material } from "@/types/material";

interface MaterialsHeaderProps {
  onNewMaterial: () => void;
}

export const MaterialsHeader: React.FC<MaterialsHeaderProps> = ({ onNewMaterial }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Materials</CardTitle>
      <Button size="sm" onClick={onNewMaterial}>
        <Plus className="mr-2 h-4 w-4" />
        New Material
      </Button>
    </CardHeader>
  );
};
