
import React from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaterialBatch } from "@/types/material";
import { DatePicker } from "@/components/ui/date-picker";

export const createBatchColumns = (
  onBatchChange: (id: string, field: keyof MaterialBatch, value: any) => void,
  onDeleteBatch: (id: string) => void
) => [
  {
    accessorKey: "batchNumber",
    header: "Batch #",
    cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => {
      const value = getValue();
      const { id } = row.original;
      
      if (!id) return <span className="text-muted-foreground italic">Auto-generated</span>;
      
      return (
        <Input
          className="w-20 h-8 text-xs"
          defaultValue={value || ""}
          onChange={(e) => onBatchChange(id, "batchNumber", e.target.value)}
        />
      );
    }
  },
  {
    accessorKey: "initialStock",
    header: "Initial Qty",
    cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => {
      const value = getValue();
      const { id } = row.original;
      
      return (
        <Input
          type="number"
          className="w-20 h-8 text-xs"
          value={value || ""}
          onChange={(e) => onBatchChange(id || "", "initialStock", Number(e.target.value))}
        />
      );
    }
  },
  {
    accessorKey: "remainingStock",
    header: "Remaining",
    cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => {
      const value = getValue();
      const { id } = row.original;
      
      return (
        <Input
          type="number"
          className="w-20 h-8 text-xs"
          value={value || ""}
          onChange={(e) => onBatchChange(id || "", "remainingStock", Number(e.target.value))}
        />
      );
    }
  },
  {
    accessorKey: "costPerUnit",
    header: "Cost/Unit",
    cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => {
      const value = getValue();
      const { id } = row.original;
      
      return (
        <Input
          type="number"
          step="0.01"
          className="w-20 h-8 text-xs"
          value={value || ""}
          onChange={(e) => onBatchChange(id || "", "costPerUnit", Number(e.target.value))}
        />
      );
    }
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => {
      const value = getValue();
      const { id } = row.original;
      
      return (
        <DatePicker
          date={value ? new Date(value) : undefined}
          onSelect={(date) => onBatchChange(id || "", "purchaseDate", date?.toISOString().split('T')[0] || null)}
          className="w-28 h-8 text-xs"
        />
      );
    }
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => {
      const value = getValue();
      const { id } = row.original;
      
      return (
        <DatePicker
          date={value ? new Date(value) : undefined}
          onSelect={(date) => onBatchChange(id || "", "expiryDate", date?.toISOString().split('T')[0] || null)}
          className="w-28 h-8 text-xs"
        />
      );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue, row }: { getValue: () => any, row: { original: MaterialBatch } }) => {
      const value = getValue();
      const { id } = row.original;
      
      if (!id) return <span className="text-muted-foreground italic">New</span>;
      
      return (
        <select 
          className="w-24 h-8 text-xs border rounded"
          value={value || "received"}
          onChange={(e) => onBatchChange(id, "status", e.target.value)}
        >
          <option value="requested">Requested</option>
          <option value="expected">Expected</option>
          <option value="delayed">Delayed</option>
          <option value="received">Received</option>
        </select>
      );
    }
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }: { row: { original: MaterialBatch } }) => {
      const { id } = row.original;
      
      if (!id) return null;
      
      return (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDeleteBatch(id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      );
    }
  }
];
