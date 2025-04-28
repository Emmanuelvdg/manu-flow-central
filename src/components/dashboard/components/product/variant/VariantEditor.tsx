
import React from 'react';
import { Input } from '@/components/ui/input';
import { ProductVariant } from '../../../types/product';

interface VariantEditorProps {
  variant: ProductVariant;
  onUpdate: (id: string, updates: Partial<ProductVariant>) => void;
  disabled?: boolean;
}

export const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  onUpdate,
  disabled = false
}) => {
  return (
    <>
      <Input 
        value={variant.sku} 
        onChange={(e) => onUpdate(variant.id, { sku: e.target.value })}
        className="w-full"
        disabled={disabled}
      />
    </>
  );
};
