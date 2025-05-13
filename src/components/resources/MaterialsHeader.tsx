
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload } from "lucide-react";
import { Material } from "@/types/material";
import { BulkUploadDialog } from "./BulkUploadDialog";

interface MaterialsHeaderProps {
  onNewMaterial: () => void;
  onBulkUpload?: (materials: Material[]) => void;
  existingMaterials?: Material[];
}

export const MaterialsHeader: React.FC<MaterialsHeaderProps> = ({ 
  onNewMaterial, 
  onBulkUpload,
  existingMaterials = []
}) => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const handleBulkUploadComplete = (materials: Material[]) => {
    if (onBulkUpload) {
      onBulkUpload(materials);
    }
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Materials</CardTitle>
        <div className="flex gap-2">
          {onBulkUpload && (
            <Button size="sm" variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
          )}
          <Button size="sm" onClick={onNewMaterial}>
            <Plus className="mr-2 h-4 w-4" />
            New Material
          </Button>
        </div>
      </CardHeader>

      {isBulkUploadOpen && onBulkUpload && (
        <BulkUploadDialog
          open={isBulkUploadOpen}
          onClose={() => setIsBulkUploadOpen(false)}
          onUploadComplete={handleBulkUploadComplete}
          templateType="materials"
          existingMaterials={existingMaterials}
        />
      )}
    </>
  );
};
