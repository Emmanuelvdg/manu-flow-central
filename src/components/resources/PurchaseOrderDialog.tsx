
import React, { useState } from "react";
import { Material, PurchaseOrder, MaterialBatch } from "@/types/material";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface PurchaseOrderProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (order: PurchaseOrder, newBatch: MaterialBatch) => Promise<void>;
}

export const PurchaseOrderDialog: React.FC<PurchaseOrderProps> = ({
  material,
  isOpen,
  onClose,
  onSubmitOrder,
}) => {
  // State for quantity, date, and price
  const [quantity, setQuantity] = useState<number>(100);
  const [price, setPrice] = useState<number>(material.costPerUnit || 0);
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  // Format date for display
  const formatDateDisplay = (date: Date) => {
    return format(date, "PPP");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the purchase order
      const order: PurchaseOrder = {
        id: `po-${Date.now()}`,
        materialId: material.id,
        quantity,
        status: "requested", // Changed from "ordered" to "requested" to match expected type
        orderDate: orderDate.toISOString(),
        expectedDelivery: deliveryDate.toISOString(),
        vendor: material.vendor || "Unknown",
        totalCost: quantity * price
      };

      // Create the new batch
      const newBatch: MaterialBatch = {
        id: `batch-${Date.now()}`,
        materialId: material.id,
        batchNumber: `B${Date.now().toString().slice(-6)}`,
        initialStock: quantity,
        remainingStock: quantity,
        costPerUnit: price,
        purchaseDate: orderDate.toISOString(),
        deliveredDate: null,
        status: "requested" // Changed from "ordered" to "requested" to match expected type
      };

      // Process the order
      await onSubmitOrder(order, newBatch);
      onClose();
    } catch (error) {
      console.error("Error processing purchase order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Purchase Order for {material.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                In {material.unit}
              </p>
            </div>
            <div>
              <Label htmlFor="price">Unit Price</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="pl-6"
                  value={price}
                  onChange={handlePriceChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Order Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !orderDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {orderDate ? formatDateDisplay(orderDate) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={orderDate}
                    onSelect={(date) => date && setOrderDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Expected Delivery</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deliveryDate ? formatDateDisplay(deliveryDate) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={(date) => date && setDeliveryDate(date)}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span>Total Cost:</span>
              <span className="font-semibold">
                ${(price * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Create Purchase Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
