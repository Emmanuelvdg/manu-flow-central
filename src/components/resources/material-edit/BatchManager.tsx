
import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialBatch } from "@/types/material";
import { BatchesTable } from '../BatchesTable';

interface BatchManagerProps {
  batches: MaterialBatch[];
  pendingBatch: MaterialBatch;
  showEmptyBatches: boolean;
  onShowEmptyBatchesChange: (show: boolean) => void;
  onBatchChange: (id: string, field: keyof MaterialBatch, value: any) => void;
  onDeleteBatch: (id: string) => void;
  onAddBatch: () => void;
}

export const BatchManager: React.FC<BatchManagerProps> = ({
  batches,
  pendingBatch,
  showEmptyBatches,
  onShowEmptyBatchesChange,
  onBatchChange,
  onDeleteBatch,
  onAddBatch,
}) => {
  // Filter out the empty pending batch when displaying
  const displayBatches = [...batches];
  
  // Only add the pending batch if we're actively adding a new one
  const allBatches = pendingBatch.id ? [...displayBatches] : [...displayBatches, pendingBatch];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Stock Batches</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showEmptyBatches}
              onChange={(e) => onShowEmptyBatchesChange(e.target.checked)}
            />
            Show empty batches
          </label>
          <Button 
            type="button" 
            onClick={onAddBatch} 
            variant="outline" 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Batch
          </Button>
        </div>
      </div>

      <BatchesTable
        batches={allBatches}
        showEmptyBatches={showEmptyBatches}
        onBatchChange={onBatchChange}
        onDeleteBatch={onDeleteBatch}
      />
    </div>
  );
};
