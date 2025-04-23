
import React from "react";
import { Button } from "@/components/ui/button";

interface OrderMetaFormProps {
  formData: {
    customerName: string;
    status: string;
    shippingAddress: string;
  };
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
}

export const OrderMetaForm: React.FC<OrderMetaFormProps> = ({
  formData,
  isLoading,
  onChange,
  onSave,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <input 
          type="text" 
          name="customerName"
          className="w-full rounded border p-2" 
          value={formData.customerName}
          onChange={onChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select 
          name="status"
          className="w-full rounded border p-2" 
          value={formData.status}
          onChange={onChange}
        >
          <option>Submitted</option>
          <option>Processing</option>
          <option>Completed</option>
          <option>Fulfilled</option>
        </select>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Shipping Address</label>
      <input 
        type="text" 
        name="shippingAddress"
        className="w-full rounded border p-2" 
        value={formData.shippingAddress}
        onChange={onChange}
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
