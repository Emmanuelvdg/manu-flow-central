
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Material } from "@/types/material";
import { MaterialEditForm } from './material-edit/MaterialEditForm';
import { BatchManager } from './material-edit/BatchManager';
import { useBatchManagement } from './material-edit/useBatchManagement';

interface MaterialEditDialogProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMaterial: Material) => void;
}

export function MaterialEditDialog({ 
  material, 
  isOpen, 
  onClose, 
  onSave 
}: MaterialEditDialogProps) {
  const [formData, setFormData] = React.useState<Material>({ ...material });
  
  const {
    batches,
    pendingBatch,
    showEmptyBatches,
    setShowEmptyBatches,
    handleBatchChange,
    handleAddBatch,
    handleDeleteBatch,
  } = useBatchManagement(material);

  React.useEffect(() => {
    setFormData({ ...material });
  }, [material]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Submit button clicked. Current batches:", batches);
    
    // Prepare batches for submission, filtering out empty pending batch
    const validBatches = batches.filter(batch => 
      batch.batchNumber && batch.batchNumber.trim() !== ''
    );
    
    console.log(`Found ${validBatches.length} valid batches out of ${batches.length} total`);
    
    // Calculate total remaining stock and average cost per unit
    const totalRemainingStock = validBatches.reduce(
      (sum, batch) => sum + Number(batch.remainingStock), 0
    );
    
    const totalCost = validBatches.reduce(
      (sum, batch) => sum + (Number(batch.remainingStock) * Number(batch.costPerUnit)), 0
    );
    
    const avgCostPerUnit = totalRemainingStock > 0 ? totalCost / totalRemainingStock : 0;
    
    const updatedMaterial = { 
      ...formData, 
      batches: validBatches,
      costPerUnit: avgCostPerUnit,
      stock: totalRemainingStock
    };
    
    console.log("Submitting material with batches:", JSON.stringify(updatedMaterial, null, 2));
    
    await onSave(updatedMaterial);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
        </DialogHeader>
        
        <MaterialEditForm
          material={formData}
          onClose={onClose}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <BatchManager
          batches={batches}
          pendingBatch={pendingBatch}
          showEmptyBatches={showEmptyBatches}
          onShowEmptyBatchesChange={setShowEmptyBatches}
          onBatchChange={handleBatchChange}
          onDeleteBatch={handleDeleteBatch}
          onAddBatch={handleAddBatch}
        />
      </DialogContent>
    </Dialog>
  );
}
