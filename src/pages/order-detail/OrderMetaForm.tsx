
import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface OrderMetaFormProps {
  formData: {
    customerName: string;
    status: string;
    shippingAddress: string;
  };
  isLoading: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  onSave: () => void;
}

export const OrderMetaForm: React.FC<OrderMetaFormProps> = ({
  formData,
  isLoading,
  onChange,
  onSave,
}) => {
  const handleStatusChange = (value: string) => {
    // Create a synthetic event-like object
    const syntheticEvent = {
      target: {
        name: "status",
        value
      }
    } as ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input 
            id="customerName"
            type="text" 
            name="customerName"
            value={formData.customerName}
            onChange={onChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={handleStatusChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Fulfilled">Fulfilled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="shippingAddress">Shipping Address</Label>
        <Input 
          id="shippingAddress"
          type="text" 
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={onChange}
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end">
        <Button 
          type="button" 
          className="ml-auto" 
          disabled={isLoading}
          onClick={onSave}
        >
          Save Order
        </Button>
      </div>
    </div>
  );
};
