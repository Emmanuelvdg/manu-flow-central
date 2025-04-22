
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/DataTable";
import { Plus, Trash } from "lucide-react";
import { Material, MaterialBatch } from "@/types/material";

interface MaterialEditDialogProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMaterial: Material) => void;
}

interface BatchColumnCellProps {
  getValue: () => any;
  row: {
    original: MaterialBatch;
  };
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
    // Calculate average cost per unit based on remaining stock in batches
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

  const batchColumns = [
    { header: 'Batch #', accessorKey: 'batchNumber' },
    { 
      header: 'Purchase Date',
      accessorKey: 'purchaseDate',
      cell: ({ getValue, row }: BatchColumnCellProps) => (
        <Input
          type="date"
          value={getValue()}
          onChange={(e) => handleBatchChange(row.original.id, 'purchaseDate', e.target.value)}
        />
      )
    },
    {
      header: 'Initial Stock',
      accessorKey: 'initialStock',
      cell: ({ getValue, row }: BatchColumnCellProps) => (
        <Input
          type="number"
          value={getValue()}
          onChange={(e) => handleBatchChange(row.original.id, 'initialStock', Number(e.target.value))}
        />
      )
    },
    {
      header: 'Remaining',
      accessorKey: 'remainingStock',
      cell: ({ getValue }: BatchColumnCellProps) => (
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
      cell: ({ getValue, row }: BatchColumnCellProps) => (
        <Input
          type="number"
          step="0.01"
          value={getValue()}
          onChange={(e) => handleBatchChange(row.original.id, 'costPerUnit', Number(e.target.value))}
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
          onClick={() => handleDeleteBatch(row.original.id)}
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
              />
            </div>
          </div>

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

            <DataTable
              columns={batchColumns}
              data={filteredBatches}
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
