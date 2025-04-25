
import React, { useEffect } from "react";
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
  // Find the current product in the list to ensure we have valid display data
  const currentProduct = React.useMemo(() => {
    return productList.find(p => p.id === productId);
  }, [productId, productList]);
  
  // Debug log to help diagnose issues
  React.useEffect(() => {
    console.log("RecipeProductSelect - Current productId:", productId);
    console.log("RecipeProductSelect - Found product:", currentProduct);
    console.log("RecipeProductSelect - Product list:", productList);
  }, [productId, currentProduct, productList]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Product<span className="text-red-500">*</span>
      </label>
      <Select value={productId} onValueChange={onProductChange} disabled={disabled}>
        <SelectTrigger className={!currentProduct && productId ? "border-orange-500" : ""}>
          <SelectValue placeholder="Select product">
            {currentProduct ? `${currentProduct.name} (${currentProduct.id})` : productId ? `${productId} (Product not in list)` : ""}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {productList.map(opt => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.name} ({opt.id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {productId && !currentProduct && (
        <p className="text-xs text-orange-500 mt-1">
          This product ID exists but is not in the dropdown list. It will still save correctly.
        </p>
      )}
    </div>
  );
}
