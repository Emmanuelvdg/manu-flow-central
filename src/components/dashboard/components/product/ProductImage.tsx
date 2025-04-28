
import React from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '../../types/product';

interface ProductImageProps {
  imageUrl: string;
  productName: string;
  category: string;
  onEdit: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  productName,
  category,
  onEdit
}) => {
  return (
    <div className="relative h-48 bg-gray-100">
      <img 
        src={imageUrl} 
        alt={productName} 
        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
          {category}
        </Badge>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 backdrop-blur-sm h-6 w-6"
          onClick={onEdit}
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
