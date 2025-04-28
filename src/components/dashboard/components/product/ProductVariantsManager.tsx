
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProductVariant, VariantType } from '../../types/product';
import { VariantEditor } from './variant/VariantEditor';
import { VariantAttributes } from './variant/VariantAttributes';
import { useVariantGeneration } from '../../hooks/useVariantGeneration';

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
  useVariantGeneration(variantTypes, variants, onVariantsChange, basePrice, disabled);
  
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map(variant => (
              <TableRow key={variant.id}>
                <TableCell>
                  <VariantEditor
                    variant={variant}
                    onUpdate={handleVariantUpdate}
                    disabled={disabled}
                  />
                </TableCell>
                
                <VariantAttributes
                  attributes={variant.attributes}
                  variantTypes={variantTypes}
                />
                
                <TableCell>
                  <Input 
                    type="number"
                    value={variant.price || ""}
                    onChange={(e) => handleVariantUpdate(
                      variant.id, 
                      { price: e.target.value ? Number(e.target.value) : null }
                    )}
                    className="w-24"
                    disabled={disabled}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
