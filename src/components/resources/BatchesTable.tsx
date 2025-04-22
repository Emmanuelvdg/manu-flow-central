
import React from 'react';
import { DataTable } from "@/components/ui/DataTable";
import { MaterialBatch } from "@/types/material";
import { createBatchColumns } from './columns/batchesColumns';

interface BatchesTableProps {
  batches: MaterialBatch[];
  showEmptyBatches: boolean;
  onBatchChange: (id: string, field: keyof MaterialBatch, value: any) => void;
  onDeleteBatch: (id: string) => void;
}

export const BatchesTable: React.FC<BatchesTableProps> = ({
  batches,
  showEmptyBatches,
  onBatchChange,
  onDeleteBatch,
}) => {
  const batchColumns = createBatchColumns(onBatchChange, onDeleteBatch);
  
  const filteredBatches = showEmptyBatches 
    ? batches 
    : batches.filter(batch => batch.remainingStock > 0);

  return (
    <DataTable columns={batchColumns} data={filteredBatches} />
  );
};
