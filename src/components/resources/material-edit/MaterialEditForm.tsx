
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Material } from "@/types/material";
import { MaterialForm } from '../MaterialForm';
import { BatchManager } from './BatchManager';
import { useBatchManagement } from './useBatchManagement';

interface MaterialEditFormProps {
  material: Material;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MaterialEditForm: React.FC<MaterialEditFormProps> = ({
  material,
  onClose,
  onChange,
  onSubmit,
}) => {
  const {
    batches,
    pendingBatch,
    showEmptyBatches,
    setShowEmptyBatches,
    handleBatchChange,
    handleAddBatch,
    handleDeleteBatch,
  } = useBatchManagement(material);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-8">
        <MaterialForm formData={material} handleChange={onChange} />
        
        <BatchManager
          batches={batches}
          pendingBatch={pendingBatch}
          showEmptyBatches={showEmptyBatches}
          onShowEmptyBatchesChange={setShowEmptyBatches}
          onBatchChange={handleBatchChange}
          onDeleteBatch={handleDeleteBatch}
          onAddBatch={handleAddBatch}
        />
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
};
