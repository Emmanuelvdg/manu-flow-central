
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ProductOption {
  id: string;
  name: string;
}

interface RecipeProductSelectProps {
  productList: ProductOption[];
  productId: string;
  onProductChange: (id: string) => void;
  disabled?: boolean;
}

export function RecipeProductSelect({ productList, productId, onProductChange, disabled }: RecipeProductSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Product<span className="text-red-500">*</span>
      </label>
      <Select value={productId} onValueChange={onProductChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select product" />
        </SelectTrigger>
        <SelectContent>
          {productList.map(opt => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.name} ({opt.id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
