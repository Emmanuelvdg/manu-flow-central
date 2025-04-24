
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { MaterialBatch } from "@/types/material";
import { Column } from "@/components/ui/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const createBatchColumns = (
  onBatchChange: (id: string, field: keyof MaterialBatch, value: any) => void,
  onDeleteBatch: (id: string) => void
): Column<MaterialBatch>[] => [
  { header: 'Batch #', accessorKey: 'batchNumber' },
  { 
    header: 'Purchase Date',
    accessorKey: 'purchaseDate',
    cell: ({ getValue, row }) => (
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
    cell: ({ getValue, row }) => (
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
    cell: ({ getValue }) => (
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
    cell: ({ getValue, row }) => (
      <Input
        type="number"
        step="0.01"
        value={getValue()}
        onChange={(e) => onBatchChange(row.original.id, 'costPerUnit', Number(e.target.value))}
      />
    )
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue, row }) => (
      <Select
        value={getValue() as string}
        onValueChange={(value) => onBatchChange(row.original.id, 'status', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="requested">Requested</SelectItem>
          <SelectItem value="expected">Expected</SelectItem>
          <SelectItem value="delayed">Delayed</SelectItem>
          <SelectItem value="received">Received</SelectItem>
        </SelectContent>
      </Select>
    )
  },
  {
    header: 'Delivered Date',
    accessorKey: 'deliveredDate',
    cell: ({ getValue, row }) => (
      <Input
        type="date"
        value={getValue() || ''}
        onChange={(e) => onBatchChange(row.original.id, 'deliveredDate', e.target.value)}
      />
    )
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: ({ row }) => (
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
