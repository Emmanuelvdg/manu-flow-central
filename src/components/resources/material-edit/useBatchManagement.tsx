
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Material, MaterialBatch } from "@/types/material";

export const useBatchManagement = (material: Material) => {
  const { toast } = useToast();
  const [batches, setBatches] = useState<MaterialBatch[]>([]);
  const [showEmptyBatches, setShowEmptyBatches] = useState(false);
  const [pendingBatch, setPendingBatch] = useState<MaterialBatch>({
    id: '',
    materialId: material.id,
    batchNumber: '',
    initialStock: 0,
    remainingStock: 0,
    costPerUnit: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'received' // Default status
  });

  useEffect(() => {
    if (material && material.batches) {
      console.log("Loading material batches:", material.batches);
      setBatches(material.batches);
    } else {
      console.log("No batches found for material:", material.id);
      setBatches([]);
    }
    
    // Reset the pending batch when material changes
    setPendingBatch({
      id: '',
      materialId: material.id,
      batchNumber: '',
      initialStock: 0,
      remainingStock: 0,
      costPerUnit: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'received' // Default status
    });
  }, [material]);

  const handleBatchChange = (id: string, field: keyof MaterialBatch, value: any) => {
    if (!id) {
      // This is the pending batch
      setPendingBatch(prev => {
        const updatedBatch = { ...prev, [field]: value };
        
        // If initial stock is updated, update remaining stock too
        if (field === 'initialStock') {
          updatedBatch.remainingStock = Number(value);
        }
        
        return updatedBatch;
      });
    } else {
      // This is an existing batch
      setBatches(batches.map(batch => {
        if (batch.id === id) {
          const updatedBatch = { ...batch, [field]: value };
          
          // If initial stock is updated, update remaining stock too
          if (field === 'initialStock') {
            updatedBatch.remainingStock = Number(value);
          }
          
          return updatedBatch;
        }
        return batch;
      }));
    }
  };

  const validateBatchData = (batch: MaterialBatch): boolean => {
    // Check required fields
    if (!batch.purchaseDate) {
      return false;
    }
    
    // Check numeric fields are valid
    if (isNaN(Number(batch.initialStock)) || Number(batch.initialStock) <= 0) {
      return false;
    }
    
    if (isNaN(Number(batch.costPerUnit)) || Number(batch.costPerUnit) <= 0) {
      return false;
    }
    
    return true;
  };

  const handleAddBatch = () => {
    if (!validateBatchData(pendingBatch)) {
      toast({
        title: "Invalid Batch Data",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }

    const batchCount = batches.length + 1;
    const batchNumber = `B${batchCount.toString().padStart(3, '0')}`;
    
    const newBatch: MaterialBatch = {
      ...pendingBatch,
      id: `batch-${Date.now()}`,
      batchNumber
    };
    
    // Add the new batch to the batches array
    setBatches(prev => [...prev, newBatch]);
    
    // Reset the pending batch
    setPendingBatch({
      id: '',
      materialId: material.id,
      batchNumber: '',
      initialStock: 0,
      remainingStock: 0,
      costPerUnit: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'received' // Default status
    });

    toast({
      title: "Batch Added",
      description: `New batch ${batchNumber} has been added successfully.`
    });
  };

  const handleDeleteBatch = (id: string) => {
    setBatches(batches.filter(batch => batch.id !== id));
  };

  return {
    batches,
    pendingBatch,
    showEmptyBatches,
    setShowEmptyBatches,
    handleBatchChange,
    handleAddBatch,
    handleDeleteBatch,
  };
};
