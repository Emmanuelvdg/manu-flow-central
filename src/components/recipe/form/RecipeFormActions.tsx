
import React from "react";
import { Button } from "@/components/ui/button";

interface RecipeFormActionsProps {
  onClose: () => void;
  loading: boolean;
  isEditing: boolean;
}

export const RecipeFormActions: React.FC<RecipeFormActionsProps> = ({
  onClose,
  loading,
  isEditing
}) => {
  return (
    <div className="flex gap-2 justify-end pt-2">
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : isEditing ? "Save" : "Create"}
      </Button>
      <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
    </div>
  );
};
