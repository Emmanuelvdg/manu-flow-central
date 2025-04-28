
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '../../types/product';
import { ProductVariantSelector } from '../ProductVariantSelector';

interface ProductDetailsProps {
  product: Product;
  selectedVariantId?: string;
  onVariantChange: (variantId: string) => void;
  variants: any[];
  variantTypes: any[];
  quantity?: number;
  onAddToCart: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  selectedVariantId,
  onVariantChange,
  variants,
  variantTypes,
  quantity,
  onAddToCart
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg truncate" title={product.name}>
        {product.name}
      </h3>
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">
          ${product.price ? product.price.toLocaleString() : '0'}
        </span>
        <span className="text-sm text-gray-500">Lead time: {product.lead_time}</span>
      </div>
      
      {product.hasvariants && variants.length > 0 && (
        <ProductVariantSelector
          variants={variants}
          variantTypes={variantTypes}
          selectedVariantId={selectedVariantId}
          onVariantChange={onVariantChange}
        />
      )}
      
      <Button 
        onClick={onAddToCart} 
        className="w-full"
        variant={quantity && quantity > 0 ? "secondary" : "default"}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {quantity && quantity > 0 ? `Added (${quantity})` : "Add to RFQ"}
      </Button>
    </div>
  );
};
