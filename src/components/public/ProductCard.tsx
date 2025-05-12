import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product, getDefaultProductImage } from '@/components/dashboard/types/product';
import { supabase } from '@/integrations/supabase/client';
import { parseJsonField } from '@/components/dashboard/utils/productUtils';
import { ProductVariantSelector } from '@/components/dashboard/components/ProductVariantSelector';

interface PublicProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variantId?: string) => void;
  quantity?: number;
}

export const PublicProductCard: React.FC<PublicProductCardProps> = ({ 
  product, 
  onAddToCart, 
  quantity 
}) => {
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>();
  const imageUrl = product.image || getDefaultProductImage(product.category);

  useEffect(() => {
    if (!product.hasvariants) return;
    
    const loadVariants = async () => {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', product.id);
          
        if (!error && data) {
          setVariants(data);
          if (data.length > 0 && !selectedVariantId) {
            setSelectedVariantId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading variants:', err);
      }
    };
    
    loadVariants();
  }, [product.id, product.hasvariants, selectedVariantId]);

  // Helper function to safely get variant types as an array with proper type assertion
  const getVariantTypes = () => {
    if (!product.varianttypes) return [] as any[];
    
    // If it's already an array, return it
    if (Array.isArray(product.varianttypes)) {
      return product.varianttypes as any[];
    }
    
    // Otherwise parse it
    const parsed = parseJsonField(product.varianttypes);
    return Array.isArray(parsed) ? parsed as any[] : [] as any[];
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariantId);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col">
      <div className="aspect-square overflow-hidden relative bg-gray-100">
        <img 
          src={imageUrl}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg truncate" title={product.name}>
              {product.name}
            </h3>
            <Badge variant="outline" className="ml-2">
              {product.category}
            </Badge>
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="font-bold text-lg">
              ${product.price ? product.price.toLocaleString() : '0'}
            </span>
            <span className="text-sm text-gray-500">Lead time: {product.lead_time}</span>
          </div>
          
          {product.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
          )}
        </div>
        
        {product.hasvariants && variants.length > 0 && (
          <div className="mt-4">
            <ProductVariantSelector
              variants={variants}
              variantTypes={getVariantTypes()}
              selectedVariantId={selectedVariantId}
              onVariantChange={setSelectedVariantId}
            />
          </div>
        )}
        
        <Button 
          onClick={handleAddToCart} 
          className="w-full mt-4"
          variant={quantity && quantity > 0 ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {quantity && quantity > 0 ? `Added (${quantity})` : "Add to Quote"}
        </Button>
      </CardContent>
    </Card>
  );
};
