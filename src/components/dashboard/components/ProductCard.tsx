import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product, getDefaultProductImage } from '../types/product';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { parseJsonField } from '../utils/productUtils';
import { ProductImage } from './product/ProductImage';
import { ProductDetails } from './product/ProductDetails';
import { ProductEditDialog } from './product/ProductEditDialog';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variantId?: string) => void;
  quantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, quantity }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>();
  const { toast } = useToast();
  
  const imageUrl = currentProduct.image || getDefaultProductImage(currentProduct.category);

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
          // Set default selected variant when variants are loaded
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

  const handleCloseDialog = async () => {
    try {
      console.log('Refreshing product with ID:', product.id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', product.id)
        .single();
        
      if (!error && data) {
        console.log('Product data from database:', data);
        
        // Transform the data to match our Product interface
        const transformedProduct = {
          ...data,
          // Ensure varianttypes is properly parsed before setting state
          varianttypes: data.varianttypes ? parseJsonField(data.varianttypes) : []
        } as Product;
        
        setCurrentProduct(transformedProduct);
        console.log('Product refreshed successfully:', transformedProduct);
      } else {
        console.error('Error refreshing product:', error);
        toast({
          title: 'Error',
          description: 'Failed to refresh product data',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Failed to refresh product:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsEditDialogOpen(false);
    }
  };

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  // Set default variant when variants are loaded
  useEffect(() => {
    if (variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(variants[0].id);
    }
  }, [variants, selectedVariantId]);

  const handleAddToCart = () => {
    onAddToCart(currentProduct, selectedVariantId);
  };

  // Helper function to safely get variant types as an array with proper type assertion
  const getVariantTypes = () => {
    if (!currentProduct.varianttypes) return [] as any[];
    
    // If it's already an array, return it
    if (Array.isArray(currentProduct.varianttypes)) {
      return currentProduct.varianttypes as any[];
    }
    
    // Otherwise parse it
    const parsed = parseJsonField(currentProduct.varianttypes);
    return Array.isArray(parsed) ? parsed as any[] : [] as any[];
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
        <ProductImage 
          imageUrl={imageUrl}
          productName={currentProduct.name}
          category={currentProduct.category}
          onEdit={() => setIsEditDialogOpen(true)}
        />
        <CardContent className="p-6">
          <ProductDetails 
            product={currentProduct}
            selectedVariantId={selectedVariantId}
            onVariantChange={setSelectedVariantId}
            variants={variants}
            variantTypes={getVariantTypes()}
            quantity={quantity}
            onAddToCart={handleAddToCart}
          />
        </CardContent>
      </Card>

      <ProductEditDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={currentProduct}
        onClose={handleCloseDialog}
      />
    </>
  );
};
