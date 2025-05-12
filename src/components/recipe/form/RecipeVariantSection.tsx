
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RecipeVariantSectionProps } from "./RecipeFormTypes";

export const RecipeVariantSection: React.FC<RecipeVariantSectionProps> = ({
  productVariants,
  selectedVariantId,
  setSelectedVariantId,
  disabled = false,
  showVariantSection
}) => {
  if (!showVariantSection) return null;
  
  // Format variant for display
  const formatVariantOption = (variant: any) => {
    if (!variant.attributes) return variant.sku;
    
    const attributeValues = Object.values(variant.attributes).join(", ");
    return `${attributeValues} (${variant.sku})`;
  };

  return (
    <div>
      <Label className="block text-sm font-medium mb-1">Product Variant</Label>
      <Select
        value={selectedVariantId}
        onValueChange={setSelectedVariantId}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a variant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="base">Base product (no variant)</SelectItem>
          {productVariants.map((variant) => (
            <SelectItem key={variant.id} value={variant.id}>
              {formatVariantOption(variant)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
