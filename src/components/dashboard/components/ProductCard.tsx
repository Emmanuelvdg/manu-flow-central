
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, getDefaultProductImage } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  quantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, quantity }) => {
  const imageUrl = product.image || getDefaultProductImage(product.category);

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative h-48 bg-gray-100">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {product.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
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
          <Button 
            onClick={() => onAddToCart(product)} 
            className="w-full"
            variant={quantity && quantity > 0 ? "secondary" : "default"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {quantity && quantity > 0 ? `Added (${quantity})` : "Add to RFQ"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
