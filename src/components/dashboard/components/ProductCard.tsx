import React, { useState, useEffect } from 'react';
import { ShoppingCart, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, getDefaultProductImage } from '../types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { EditProductForm } from '../EditProductForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductVariantSelector } from './ProductVariantSelector';
import { parseJsonField } from '../utils/productUtils';

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
        }
      } catch (err) {
        console.error('Error loading variants:', err);
      }
    };
    
    loadVariants();
  }, [product.id, product.hasvariants]);

  const handleCloseDialog = () => {
    const refreshProduct = async () => {
      try {
        console.log('Refreshing product with ID:', product.id);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', product.id)
          .single();
          
        if (!error && data) {
          console.log('Product data from database:', data);
          const transformedProduct = {
            ...data,
            varianttypes: parseJsonField(data.varianttypes) as any
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
      }
    };
    
    refreshProduct();
    setIsEditDialogOpen(false);
  };

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  const handleAddToCart = () => {
    onAddToCart(currentProduct, selectedVariantId);
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
        <div className="relative h-48 bg-gray-100">
          <img 
            src={imageUrl} 
            alt={currentProduct.name} 
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {currentProduct.category}
            </Badge>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 backdrop-blur-sm h-6 w-6"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg truncate" title={currentProduct.name}>
              {currentProduct.name}
            </h3>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">
                ${currentProduct.price ? currentProduct.price.toLocaleString() : '0'}
              </span>
              <span className="text-sm text-gray-500">Lead time: {currentProduct.lead_time}</span>
            </div>
            
            {currentProduct.hasvariants && variants.length > 0 && (
              <ProductVariantSelector
                variants={variants}
                variantTypes={parseJsonField(currentProduct.varianttypes) || []}
                selectedVariantId={selectedVariantId}
                onVariantChange={setSelectedVariantId}
              />
            )}
            
            <Button 
              onClick={handleAddToCart} 
              className="w-full"
              variant={quantity && quantity > 0 ? "secondary" : "default"}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {quantity && quantity > 0 ? `Added (${quantity})` : "Add to RFQ"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product. The image URL will be saved with your changes.
            </DialogDescription>
          </DialogHeader>
          <EditProductForm 
            product={currentProduct} 
            onClose={handleCloseDialog} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
