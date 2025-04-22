
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/DataTable";
import { MaterialBatch } from "@/types/material";
import { Trash } from "lucide-react";

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
  const batchColumns = [
    { header: 'Batch #', accessorKey: 'batchNumber' },
    { 
      header: 'Purchase Date',
      accessorKey: 'purchaseDate',
      cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => (
        <Input
          type="date"
          value={getValue()}
          onChange={(e) => onBatchChange(row.original.id, 'purchaseDate', e.target.value)}
        />
      )
    },
    {
      header: 'Initial Stock',
      accessorKey: 'initialStock',
      cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => (
        <Input
          type="number"
          value={getValue()}
          onChange={(e) => onBatchChange(row.original.id, 'initialStock', Number(e.target.value))}
        />
      )
    },
    {
      header: 'Remaining',
      accessorKey: 'remainingStock',
      cell: ({ getValue }: { getValue: () => any }) => (
        <Input
          type="number"
          value={getValue()}
          readOnly
        />
      )
    },
    {
      header: 'Cost/Unit',
      accessorKey: 'costPerUnit',
      cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => (
        <Input
          type="number"
          step="0.01"
          value={getValue()}
          onChange={(e) => onBatchChange(row.original.id, 'costPerUnit', Number(e.target.value))}
        />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: { original: MaterialBatch } }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteBatch(row.original.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const filteredBatches = showEmptyBatches 
    ? batches 
    : batches.filter(batch => batch.remainingStock > 0);

  return (
    <DataTable columns={batchColumns} data={filteredBatches} />
  );
};
