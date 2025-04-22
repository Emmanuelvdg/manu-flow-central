
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
  const [batches, setBatches] = useState<MaterialBatch[]>(material.batches || []);
  const [showEmptyBatches, setShowEmptyBatches] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddBatch = () => {
    const newBatch: MaterialBatch = {
      id: `batch-${Date.now()}`,
      materialId: material.id,
      batchNumber: `B${(batches.length + 1).toString().padStart(3, '0')}`,
      initialStock: 0,
      remainingStock: 0,
      costPerUnit: 0,
      purchaseDate: new Date().toISOString().split('T')[0]
    };
    setBatches([...batches, newBatch]);
  };

  const handleBatchChange = (id: string, field: keyof MaterialBatch, value: any) => {
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
    setBatches(batches.filter(batch => batch.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalRemainingStock = batches.reduce((sum, batch) => sum + batch.remainingStock, 0);
    const totalCost = batches.reduce((sum, batch) => sum + (batch.remainingStock * batch.costPerUnit), 0);
    const avgCostPerUnit = totalRemainingStock > 0 ? totalCost / totalRemainingStock : 0;
    
    const updatedMaterial = { 
      ...formData, 
      batches,
      costPerUnit: avgCostPerUnit,
      stock: totalRemainingStock
    };
    
    onSave(updatedMaterial);
    toast({
      title: "Material Updated",
      description: `${formData.name} has been updated successfully.`,
    });
    onClose();
  };

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
                <Button type="button" onClick={handleAddBatch}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Batch
                </Button>
              </div>
            </div>

            <BatchesTable
              batches={batches}
              showEmptyBatches={showEmptyBatches}
              onBatchChange={handleBatchChange}
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
