
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '../types/product';
import { CartItem } from '../ProductCatalog';
import { formatVariantAttributes } from '../utils/productUtils';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (product: Product, variantId?: string) => {
    setCartItems(prev => {
      if (product.hasvariants && !variantId) {
        toast({
          title: "Select Variant",
          description: "Please select a product variant before adding to RFQ",
          variant: "destructive",
        });
        return prev;
      }
      
      let variant = undefined;
      if (variantId && product.variants) {
        variant = product.variants.find(v => v.id === variantId);
      }
      
      const idx = prev.findIndex(item => 
        item.product.id === product.id && 
        ((!variantId && !item.variantId) || (item.variantId === variantId))
      );
      
      if (idx === -1) {
        toast({
          title: "Added to RFQ",
          description: `${product.name}${variant ? ` (${formatVariantAttributes(variant.attributes)})` : ''} has been added to your quote request.`,
        });
        return [...prev, { product, quantity: 1, variantId, variant }];
      } else {
        const newCart = [...prev];
        newCart[idx].quantity += 1;
        toast({
          title: "Quantity Increased",
          description: `Increased quantity of ${product.name}${variant ? ` (${formatVariantAttributes(variant.attributes)})` : ''} to ${newCart[idx].quantity}.`,
        });
        return newCart;
      }
    });
  };

  const removeFromCart = (index: number) => {
    const item = cartItems[index];
    setCartItems(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Removed from RFQ",
      description: `${item.product.name}${item.variant ? ` (${formatVariantAttributes(item.variant.attributes)})` : ''} has been removed from your quote request.`,
    });
  };

  const updateQuantity = (index: number, newQty: number) => {
    setCartItems(prev => {
      if (newQty < 1) {
        const item = prev[index];
        toast({
          title: "Removed from RFQ",
          description: `${item.product.name}${item.variant ? ` (${formatVariantAttributes(item.variant.attributes)})` : ''} has been removed from your quote request.`,
        });
        return prev.filter((_, i) => i !== index);
      }
      
      const newCart = [...prev];
      newCart[index].quantity = newQty;
      return newCart;
    });
  };

  const clearCart = () => setCartItems([]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
