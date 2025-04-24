
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { createBatchColumns } from './columns/batchesColumns';
import { MaterialBatch } from '@/types/material';

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
  // Create batch columns with the handlers
  const columns = createBatchColumns(onBatchChange, onDeleteBatch);

  // Filter batches based on preferences but always include pending batch (without id or with empty id)
  const displayBatches = showEmptyBatches
    ? batches
    : batches.filter(batch => 
        batch.remainingStock > 0 || !batch.id || batch.id === ''
      );

  if (displayBatches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded">
        No batches available. Add a new batch above.
      </div>
    );
  }

  return (
    <div className="border rounded">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayBatches.map((batch, index) => (
            <TableRow key={batch.id || `pending-${index}`}>
              {columns.map(column => (
                <TableCell key={`${batch.id || 'pending'}-${column.accessorKey}`}>
                  {column.cell ? 
                    column.cell({ getValue: () => batch[column.accessorKey as keyof MaterialBatch], row: { original: batch } }) : 
                    batch[column.accessorKey as keyof MaterialBatch]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
