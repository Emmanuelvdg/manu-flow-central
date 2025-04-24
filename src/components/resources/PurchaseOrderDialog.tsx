import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Material, PurchaseOrder, MaterialBatch } from "@/types/material";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface PurchaseOrderDialogProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (order: PurchaseOrder, newBatch: MaterialBatch) => void;
}

export function PurchaseOrderDialog({ 
  material, 
  isOpen, 
  onClose, 
  onCreateOrder 
}: PurchaseOrderDialogProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<number>(1);
  const [expectedDelivery, setExpectedDelivery] = useState<string>("");
  const [costPerUnit, setCostPerUnit] = useState<number>(material.costPerUnit || 0);
  const [batchStatus, setBatchStatus] = useState<MaterialBatch['status']>('requested');
  
  const calculateTotalCost = (): number => {
    return quantity * costPerUnit;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder: PurchaseOrder = {
      id: `PO-${Date.now().toString().slice(-6)}`,
      materialId: material.id,
      quantity: quantity,
      status: 'Pending',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: expectedDelivery,
      vendor: material.vendor,
      totalCost: calculateTotalCost()
    };
    
    const newBatch: MaterialBatch = {
      id: `batch-${Date.now()}`,
      materialId: material.id,
      batchNumber: `B${Date.now().toString().slice(-6)}`,
      initialStock: quantity,
      remainingStock: quantity,
      costPerUnit: costPerUnit,
      purchaseDate: newOrder.orderDate,
      deliveredDate: expectedDelivery,
      status: batchStatus
    };

    onCreateOrder(newOrder, newBatch);
    
    toast({
      title: "Purchase Order Created",
      description: `Order ${newOrder.id} for ${material.name} has been created with a new batch.`,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Material</Label>
              <div className="col-span-3 font-medium">{material.name}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Vendor</Label>
              <div className="col-span-3">{material.vendor}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Cost Per Unit</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(parseFloat(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalCost" className="text-right">Total Cost</Label>
              <Input
                id="totalCost"
                value={calculateTotalCost().toFixed(2)}
                readOnly
                className="col-span-3 bg-gray-50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expectedDelivery" className="text-right">Expected Delivery</Label>
              <Input
                id="expectedDelivery"
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batchStatus" className="text-right">Batch Status</Label>
              <Select 
                value={batchStatus} 
                onValueChange={(value: MaterialBatch['status']) => setBatchStatus(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select batch status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="expected">Expected</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
