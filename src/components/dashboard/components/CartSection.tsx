
import React from "react";
import { Button } from "@/components/ui/button";
import { CartItem } from "../ProductCatalog";
import { Minus, Plus } from "lucide-react";

interface CartSectionProps {
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  onUpdateQuantity: (productId: number, newQty: number) => void;
}

export const CartSection: React.FC<CartSectionProps> = ({
  cartItems,
  onRemoveItem,
  onClearCart,
  onUpdateQuantity,
}) => {
  if (cartItems.length === 0) return null;

  return (
    <div className="bg-white rounded shadow p-4 border mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">RFQ Cart</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearCart}
          className="ml-2"
        >
          Clear Cart
        </Button>
      </div>
      <div className="space-y-3">
        {cartItems.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 border-b pb-2 last:border-b-0"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 object-cover rounded"
            />
            <div className="flex-1">
              <div className="font-medium">{product.name}</div>
              <div className="text-xs text-gray-500">{product.category}</div>
              <div className="text-sm text-gray-800">${product.price.toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="w-7 h-7"
                aria-label="Decrease quantity"
                onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="min-w-[24px] text-center font-mono">{quantity}</span>
              <Button
                variant="secondary"
                size="icon"
                className="w-7 h-7"
                aria-label="Increase quantity"
                onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Remove item"
              onClick={() => onRemoveItem(product.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
