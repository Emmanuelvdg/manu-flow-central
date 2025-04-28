
import { useEffect } from 'react';
import { ProductVariant, VariantType } from '../types/product';

export function useVariantGeneration(
  variantTypes: VariantType[],
  variants: ProductVariant[],
  onVariantsChange: (variants: ProductVariant[]) => void,
  basePrice: number,
  disabled: boolean
) {
  useEffect(() => {
    if (disabled) return;
    
    const combinations = generateVariantCombinations(variantTypes);
    
    // If no combinations, don't change variants
    if (combinations.length === 0) return;
    
    // Create new variants based on combinations
    const newVariants = combinations.map(attributes => {
      // Check if we already have this variant
      const existingVariant = variants.find(v => 
        Object.entries(attributes).every(
          ([key, value]) => v.attributes[key] === value
        )
      );
      
      if (existingVariant) {
        return existingVariant;
      }
      
      // Generate a SKU from the attributes
      const sku = generateSkuFromAttributes(attributes);
        
      // Create a new variant
      return {
        id: `variant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        productId: '', // Will be filled in when saving to database
        attributes,
        sku,
        price: basePrice,
      };
    });
    
    onVariantsChange(newVariants);
  }, [variantTypes, disabled]);
  
  return {
    generateSkuFromAttributes,
    generateVariantCombinations
  };
}

function generateVariantCombinations(variantTypes: VariantType[]): Record<string, string>[] {
  // If no variant types with options, return empty array
  if (variantTypes.length === 0 || variantTypes.every(t => t.options.length === 0)) {
    return [];
  }
  
  // Start with an initial array containing one empty object
  let combinations: Record<string, string>[] = [{}];
  
  // For each variant type, create new combinations
  variantTypes.forEach(type => {
    if (type.options.length === 0) return; // Skip types without options
    
    const newCombinations: Record<string, string>[] = [];
    
    // For each existing combination, create a new one for each option
    combinations.forEach(combination => {
      type.options.forEach(option => {
        newCombinations.push({
          ...combination,
          [type.name]: option
        });
      });
    });
    
    combinations = newCombinations;
  });
  
  return combinations;
}

function generateSkuFromAttributes(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .map(([_, value]) => value.substring(0, 3).toUpperCase())
    .join('-');
}
