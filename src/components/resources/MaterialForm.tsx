
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Material } from "@/types/material";

interface MaterialFormProps {
  formData: Material;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({ formData, handleChange }) => {
  return (
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
  );
};
