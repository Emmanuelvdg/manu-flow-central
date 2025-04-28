
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CartItems } from './cart/CartItems';
import { CartTotal } from './cart/CartTotal';

interface CartItem {
  product: any;
  quantity: number;
  variantId?: string;
  variant?: Record<string, any>;
}

interface CartSectionProps {
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onClearCart: () => void;
}

export const CartSection: React.FC<CartSectionProps> = ({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}) => {
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return null;
  }

  const handleCreateRFQ = () => {
    navigate('/rfqs/create');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CartItems
            items={cartItems}
            onRemoveItem={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
          />
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <CartTotal items={cartItems} />
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={onClearCart} className="flex-1 md:flex-none">
                Clear
              </Button>
              <Button onClick={handleCreateRFQ} className="flex-1 md:flex-none">
                Create RFQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
