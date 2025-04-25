
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
  loading?: boolean;
}

export function RecipeProductSelect({ 
  productList, 
  productId, 
  onProductChange, 
  disabled, 
  loading = false 
}: RecipeProductSelectProps) {
  // Find the current product in the list to ensure we have valid display data
  const currentProduct = React.useMemo(() => {
    return productList.find(p => p.id === productId);
  }, [productId, productList]);
  
  // Debug log to help diagnose issues
  React.useEffect(() => {
    console.log("RecipeProductSelect - Current productId:", productId);
    console.log("RecipeProductSelect - Found product:", currentProduct);
    console.log("RecipeProductSelect - Product list length:", productList.length);
    console.log("RecipeProductSelect - Loading state:", loading);
  }, [productId, currentProduct, productList, loading]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Product<span className="text-red-500">*</span>
      </label>
      <Select 
        value={productId || ""} 
        onValueChange={onProductChange} 
        disabled={disabled || loading}
      >
        <SelectTrigger className={!currentProduct && productId ? "border-orange-500" : ""}>
          <SelectValue placeholder={loading ? "Loading products..." : "Select product"}>
            {currentProduct ? 
              `${currentProduct.name} (${currentProduct.id})` : 
              productId ? 
                `${productId} (Product not in list)` : 
                ""}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {productList.length === 0 && loading && (
            <SelectItem value="loading" disabled>Loading products...</SelectItem>
          )}
          {productList.length === 0 && !loading && (
            <SelectItem value="none" disabled>No products available</SelectItem>
          )}
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
