
import React, { useState, useMemo } from 'react';
import { ProductVariant, VariantType } from '../types/product';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  variantTypes: VariantType[];
  selectedVariantId?: string;
  onVariantChange: (variantId: string) => void;
  disabled?: boolean;
}

export function ProductVariantSelector({
  variants,
  variantTypes,
  selectedVariantId,
  onVariantChange,
  disabled = false
}: ProductVariantSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  
  // When variant changes externally, update the selected attributes
  React.useEffect(() => {
    if (selectedVariantId) {
      const variant = variants.find(v => v.id === selectedVariantId);
      if (variant) {
        setSelectedAttributes(variant.attributes);
      }
    }
  }, [selectedVariantId, variants]);

  // Find available options for each attribute based on current selection
  const availableOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    
    variantTypes.forEach(type => {
      // For each variant type, find available options based on current selections
      const filteredVariants = variants.filter(variant => {
        // Check if variant matches all currently selected attributes
        return Object.entries(selectedAttributes).every(([attrName, attrValue]) => {
          // Skip the current attribute we're calculating options for
          if (attrName === type.name) return true;
          // Check if variant attribute matches selected value
          return variant.attributes[attrName] === attrValue;
        });
      });
      
      // Get unique options for this attribute from filtered variants
      options[type.name] = Array.from(
        new Set(filteredVariants.map(v => v.attributes[type.name]))
      ).filter(Boolean);
    });
    
    return options;
  }, [variants, variantTypes, selectedAttributes]);

  // Find the matching variant based on selected attributes
  const matchingVariant = useMemo(() => {
    // Only look for match if we have selected attributes
    if (Object.keys(selectedAttributes).length === 0) return null;
    
    return variants.find(variant => 
      Object.entries(selectedAttributes).every(
        ([key, value]) => variant.attributes[key] === value
      )
    );
  }, [variants, selectedAttributes]);

  // When a matching variant is found, trigger the callback
  React.useEffect(() => {
    if (matchingVariant && matchingVariant.id !== selectedVariantId) {
      onVariantChange(matchingVariant.id);
    }
  }, [matchingVariant, onVariantChange, selectedVariantId]);

  // Handle selection change for a specific attribute
  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  if (variants.length === 0 || variantTypes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Select Variant</div>
      
      {variantTypes.map(type => (
        <div key={type.name} className="space-y-1.5">
          <Label htmlFor={`variant-${type.name}`}>{type.name}</Label>
          <Select
            value={selectedAttributes[type.name] || ''}
            onValueChange={(value) => handleAttributeChange(type.name, value)}
            disabled={disabled || availableOptions[type.name]?.length === 0}
          >
            <SelectTrigger id={`variant-${type.name}`}>
              <SelectValue placeholder={`Select ${type.name}`} />
            </SelectTrigger>
            <SelectContent>
              {availableOptions[type.name]?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      
      {matchingVariant && (
        <div className="pt-2">
          <Badge variant="outline" className="gap-1">
            SKU: {matchingVariant.sku}
          </Badge>
          {matchingVariant.price && (
            <Badge variant="secondary" className="ml-2">
              ${matchingVariant.price.toLocaleString()}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
