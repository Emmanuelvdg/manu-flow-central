
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Material, MaterialBatch } from "@/types/material";
import { MaterialForm } from './MaterialForm';
import { BatchesTable } from './BatchesTable';

interface MaterialEditDialogProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMaterial: Material) => void;
}

export function MaterialEditDialog({ material, isOpen, onClose, onSave }: MaterialEditDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Material>({ ...material });
  const [batches, setBatches] = useState<MaterialBatch[]>([]);
  const [showEmptyBatches, setShowEmptyBatches] = useState(false);
  const [pendingBatch, setPendingBatch] = useState<MaterialBatch>({
    id: '',
    materialId: material.id,
    batchNumber: '',
    initialStock: 0,
    remainingStock: 0,
    costPerUnit: 0,
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  // Load material batches when the dialog opens or material changes
  useEffect(() => {
    if (material && material.batches) {
      console.log("Loading material batches:", material.batches);
      setBatches(material.batches);
    } else {
      console.log("No batches found for material:", material.id);
      setBatches([]);
    }
    // Reset the pending batch
    setPendingBatch({
      id: '',
      materialId: material.id,
      batchNumber: '',
      initialStock: 0,
      remainingStock: 0,
      costPerUnit: 0,
      purchaseDate: new Date().toISOString().split('T')[0]
    });
  }, [material]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePendingBatchChange = (field: keyof MaterialBatch, value: any) => {
    setPendingBatch(prev => ({
      ...prev,
      [field]: value,
      // Update remaining stock when initial stock changes
      ...(field === 'initialStock' ? { remainingStock: Number(value) } : {})
    }));
  };

  const handleAddBatch = () => {
    // Validate the pending batch
    if (!pendingBatch.purchaseDate || pendingBatch.initialStock <= 0 || pendingBatch.costPerUnit <= 0) {
      toast({
        title: "Invalid Batch Data",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }

    // Generate batch number
    const batchCount = batches.length + 1;
    const batchNumber = `B${batchCount.toString().padStart(3, '0')}`;
    
    // Create new batch with generated ID and batch number
    const newBatch: MaterialBatch = {
      ...pendingBatch,
      id: `batch-${Date.now()}`,
      batchNumber
    };
    
    console.log("Adding new batch:", newBatch);
    
    // Add the new batch to the list
    setBatches(prevBatches => [...prevBatches, newBatch]);
    
    // Reset pending batch
    setPendingBatch({
      id: '',
      materialId: material.id,
      batchNumber: '',
      initialStock: 0,
      remainingStock: 0,
      costPerUnit: 0,
      purchaseDate: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Batch Added",
      description: `New batch ${batchNumber} has been added successfully.`
    });
  };

  const handleBatchChange = (id: string, field: keyof MaterialBatch, value: any) => {
    console.log(`Updating batch ${id}, field ${field} to value:`, value);
    setBatches(batches.map(batch => {
      if (batch.id === id) {
        const updatedBatch = { ...batch, [field]: value };
        if (field === 'initialStock') {
          updatedBatch.remainingStock = Number(value);
        }
        return updatedBatch;
      }
      return batch;
    }));
  };

  const handleDeleteBatch = (id: string) => {
    console.log(`Deleting batch with ID: ${id}`);
    setBatches(batches.filter(batch => batch.id !== id));
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
    
    // Pass the updated material to the parent component
    await onSave(updatedMaterial);
    
    // We don't need to show a toast here as the parent component will do that
    onClose();
  };

  // Only show valid batches (with batch numbers) and the pending batch for display
  const displayBatches = showEmptyBatches 
    ? [...batches, pendingBatch] 
    : [...batches.filter(b => b.remainingStock > 0 || !b.batchNumber), pendingBatch];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <MaterialForm formData={formData} handleChange={handleChange} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Stock Batches</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showEmptyBatches}
                    onChange={(e) => setShowEmptyBatches(e.target.checked)}
                  />
                  Show empty batches
                </label>
                <Button 
                  type="button" 
                  onClick={handleAddBatch} 
                  variant="outline" 
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Batch
                </Button>
              </div>
            </div>

            <BatchesTable
              batches={displayBatches}
              showEmptyBatches={true}
              onBatchChange={(id, field, value) => {
                // If it's the pending batch (empty id), update pending state
                if (!id) {
                  handlePendingBatchChange(field, value);
                } else {
                  handleBatchChange(id, field, value);
                }
              }}
              onDeleteBatch={handleDeleteBatch}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
