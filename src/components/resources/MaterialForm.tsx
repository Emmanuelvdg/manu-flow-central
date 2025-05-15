
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Material } from "@/types/material";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface MaterialFormProps {
  formData: Material;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({ 
  formData, 
  handleChange, 
  handleSelectChange 
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Input
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vendor">Vendor</Label>
        <Input
          id="vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="abcClassification">ABC Classification</Label>
        <Select 
          value={formData.abcClassification || 'C'} 
          onValueChange={(value) => handleSelectChange && handleSelectChange('abcClassification', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select classification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A - High Value</SelectItem>
            <SelectItem value="B">B - Medium Value</SelectItem>
            <SelectItem value="C">C - Low Value</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
