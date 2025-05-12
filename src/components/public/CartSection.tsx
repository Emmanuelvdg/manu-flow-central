
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/components/dashboard/ProductCatalog';
import { formatVariantAttributes } from '@/components/dashboard/utils/productUtils';

interface CartSectionProps {
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onClearCart: () => void;
}

export const CartSection: React.FC<CartSectionProps> = ({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasItems = totalItems > 0;

  const handleRequestQuote = () => {
    navigate('/public/quote');
  };

  if (!hasItems) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 z-10 w-full md:w-auto">
      <Card className="shadow-lg border border-gray-200 w-full md:w-96">
        <CardHeader className="pb-2 pt-4 px-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Your Quote ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}>
              {isExpanded ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <>
            <CardContent className="px-4">
              <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={`${item.product.id}-${item.variantId || 'default'}`} className="py-3 flex justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.product.name}</div>
                      {item.variant && (
                        <div className="text-sm text-gray-500">
                          {formatVariantAttributes(item.variant.attributes)}
                        </div>
                      )}
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 0) {
                              onUpdateQuantity(index, val);
                            }
                          }}
                          className="h-6 w-12 mx-1 px-1 text-center"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onRemoveItem(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {hasItems && (
                <div className="flex justify-end mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearCart();
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="px-4 pb-4">
              <Button className="w-full" onClick={handleRequestQuote}>
                Request Quote
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};
