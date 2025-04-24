
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Stock Batches</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={showEmptyBatches}
              onChange={(e) => onShowEmptyBatchesChange(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show empty batches
          </label>
          <Button 
            type="button" 
            onClick={onAddBatch} 
            variant="outline" 
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Batch
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <BatchesTable
          batches={[...batches, pendingBatch]}
          showEmptyBatches={showEmptyBatches}
          onBatchChange={onBatchChange}
          onDeleteBatch={onDeleteBatch}
        />
      </div>
    </div>
  );
};
