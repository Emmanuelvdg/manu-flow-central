
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddStageButtonProps {
  handleAddRoutingStage: () => void;
  disabled?: boolean;
}

const AddStageButton: React.FC<AddStageButtonProps> = ({
  handleAddRoutingStage,
  disabled = false
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      className="text-xs mt-1"
      onClick={handleAddRoutingStage}
      disabled={disabled}
    >
      <Plus className="w-3 h-3 mr-1" /> Add Routing Stage
    </Button>
  );
};

export default AddStageButton;
