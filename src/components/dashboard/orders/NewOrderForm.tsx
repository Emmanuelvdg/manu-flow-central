
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

export const NewOrderForm = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    partNo: "",
    partDescription: "",
    quantity: "1",
    status: "created",
    partsStatus: "Not booked",
    shippingAddress: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Generate order number
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      
      const orderNumber = `ORD-${String(1000 + (count || 0) + 1).slice(1)}`;
      
      // Create a minimal products array
      const products = [{
        partNo: formData.partNo,
        partDescription: formData.partDescription,
        quantity: parseInt(formData.quantity) || 1
      }];
      
      // Insert the new order
      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_name: formData.customerName,
          order_number: orderNumber,
          status: formData.status,
          parts_status: formData.partsStatus,
          shipping_address: formData.shippingAddress,
          products: products,
          total: 0 // This would need to be calculated based on actual product prices
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Work Order created",
        description: `Work Order ${orderNumber} has been created successfully.`,
      });
      
      onClose();
      
      // Navigate to the new order detail page
      if (data && data[0]) {
        navigate(`/orders/${orderNumber}`);
      }
    } catch (error: any) {
      console.error("Error creating work order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create work order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="customerName">Customer Name</Label>
        <Input
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="partNo">Part Number</Label>
        <Input
          id="partNo"
          name="partNo"
          value={formData.partNo}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="partDescription">Part Description</Label>
        <Input
          id="partDescription"
          name="partDescription"
          value={formData.partDescription}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="shippingAddress">Shipping Address</Label>
        <Textarea
          id="shippingAddress"
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Work Order"}
        </Button>
      </div>
    </form>
  );
};
