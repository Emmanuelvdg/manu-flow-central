
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash } from 'lucide-react';
import { CartItem } from '../../ProductCatalog';

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
}

export const CartItems: React.FC<CartItemsProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  // Helper function to format variant attributes for display
  const formatVariantAttributes = (attributes: Record<string, string> | null | undefined): string => {
    if (!attributes) return '';
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Your quote request is empty
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={`${item.product.id}-${item.variantId || 'base'}`} className="flex gap-4 py-2 border-b">
          <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
            <img 
              src={item.product.image || 'https://via.placeholder.com/150'} 
              alt={item.product.name} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
            {item.variant && (
              <p className="text-xs text-muted-foreground">
                {formatVariantAttributes(item.variant.attributes)}
                {item.variant.sku && <span className="block mt-1">SKU: {item.variant.sku}</span>}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center border rounded overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-none"
                  onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-none"
                  onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onRemoveItem(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              ${((item.variant?.price || item.product.price || 0) * item.quantity).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              ${(item.variant?.price || item.product.price || 0).toLocaleString()} each
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
