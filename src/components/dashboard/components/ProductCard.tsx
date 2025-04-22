
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">${product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500">Lead time: {product.leadTime}</span>
          </div>
          <Button 
            onClick={() => onAddToCart(product)} 
            className="w-full"
            variant="default"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to RFQ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
