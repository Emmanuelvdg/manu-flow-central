
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Material } from "@/types/material";
import { MaterialEditForm } from './material-edit/MaterialEditForm';
import { BatchManager } from './material-edit/BatchManager';
import { useBatchManagement } from './material-edit/useBatchManagement';
import { useQueryClient } from '@tanstack/react-query';

interface MaterialEditDialogProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMaterial: Material) => Promise<void>;
}

export function MaterialEditDialog({ 
  material, 
  isOpen, 
  onClose, 
  onSave 
}: MaterialEditDialogProps) {
  const [formData, setFormData] = React.useState<Material>({ ...material });
  const queryClient = useQueryClient();
  
  const {
    batches,
    pendingBatch,
    showEmptyBatches,
    setShowEmptyBatches,
    handleBatchChange,
    handleAddBatch,
    handleDeleteBatch,
  } = useBatchManagement(material);

  // Reset form data when material changes
  React.useEffect(() => {
    setFormData({ ...material });
  }, [material]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Submit button clicked. Current batches:", batches);
    
    // Collect all valid batches, including the pending batch if it has data
    let allBatches = [...batches];
    
    // Add pending batch if it has valid data
    if (pendingBatch.initialStock > 0 && pendingBatch.costPerUnit > 0) {
      // Create a batch number if it doesn't exist
      const batchNumber = pendingBatch.batchNumber || 
        `B${(batches.length + 1).toString().padStart(3, '0')}`;
      
      allBatches.push({
        ...pendingBatch,
        id: pendingBatch.id || `pending-${Date.now()}`,
        batchNumber
      });
    }
    
    // Filter out any invalid batches
    const validBatches = allBatches.filter(batch => 
      batch.initialStock > 0 && batch.costPerUnit > 0
    );
    
    console.log(`Found ${validBatches.length} valid batches out of ${allBatches.length} total`);
    
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
    
    // Force a refresh of the material data
    queryClient.invalidateQueries({ queryKey: ["material-batches"] });
    queryClient.invalidateQueries({ queryKey: ["materials"] });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <MaterialEditForm
            material={formData}
            onClose={onClose}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
