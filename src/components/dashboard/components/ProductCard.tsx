
import React, { useState } from 'react';
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

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  quantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, quantity }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);
  const imageUrl = currentProduct.image || getDefaultProductImage(currentProduct.category);

  // Handle dialog closing and product updates
  const handleCloseDialog = () => {
    // Refresh the product data when dialog closes
    const refreshProduct = async () => {
      try {
        const { data, error } = await fetch(`/api/products/${product.id}`).then(res => res.json());
        if (!error && data) {
          setCurrentProduct(data);
        }
      } catch (err) {
        console.error('Failed to refresh product:', err);
      }
    };
    
    refreshProduct();
    setIsEditDialogOpen(false);
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
            <Button 
              onClick={() => onAddToCart(currentProduct)} 
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
