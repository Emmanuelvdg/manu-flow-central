
import React, { useState, useEffect } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ProductVariant, VariantType } from '../types/product';

interface ProductVariantsManagerProps {
  variantTypes: VariantType[];
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  basePrice?: number;
  disabled?: boolean;
}

export function ProductVariantsManager({
  variantTypes,
  variants,
  onVariantsChange,
  basePrice = 0,
  disabled = false
}: ProductVariantsManagerProps) {
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  
  // Generate all possible combinations of variant attributes
  const generateVariantCombinations = () => {
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
  };
  
  // Auto-generate variants when variant types change
  useEffect(() => {
    if (disabled) return;
    
    const combinations = generateVariantCombinations();
    
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
      const sku = Object.entries(attributes)
        .map(([_, value]) => value.substring(0, 3).toUpperCase())
        .join('-');
        
      // Create a new variant
      return {
        id: `variant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        productId: '', // Will be filled in when saving to database
        attributes,
        sku: sku,
        price: basePrice,
      };
    });
    
    onVariantsChange(newVariants);
  }, [variantTypes, disabled]);
  
  const handleVariantUpdate = (id: string, updates: Partial<ProductVariant>) => {
    const updatedVariants = variants.map(variant => 
      variant.id === id ? { ...variant, ...updates } : variant
    );
    onVariantsChange(updatedVariants);
  };
  
  // No variant types defined, nothing to show
  if (variantTypes.length === 0 || variantTypes.every(t => t.options.length === 0)) {
    return (
      <div className="text-sm text-muted-foreground italic py-2">
        Add variant types and options above to generate product variants.
      </div>
    );
  }
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Product Variants</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              {variantTypes.map(type => (
                <TableHead key={type.name}>{type.name}</TableHead>
              ))}
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map(variant => (
              <TableRow key={variant.id}>
                <TableCell>
                  {editingVariant === variant.id ? (
                    <Input 
                      value={variant.sku} 
                      onChange={(e) => handleVariantUpdate(variant.id, { sku: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    variant.sku
                  )}
                </TableCell>
                
                {variantTypes.map(type => (
                  <TableCell key={type.name}>
                    <Badge variant="outline">
                      {variant.attributes[type.name] || '-'}
                    </Badge>
                  </TableCell>
                ))}
                
                <TableCell>
                  {editingVariant === variant.id ? (
                    <Input 
                      type="number"
                      value={variant.price || ""}
                      onChange={(e) => handleVariantUpdate(
                        variant.id, 
                        { price: e.target.value ? Number(e.target.value) : null }
                      )}
                      className="w-24"
                    />
                  ) : (
                    variant.price ? `$${variant.price.toLocaleString()}` : '-'
                  )}
                </TableCell>
                
                <TableCell>
                  {editingVariant === variant.id ? (
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={() => setEditingVariant(null)}
                        disabled={disabled}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingVariant(variant.id)}
                        disabled={disabled}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
