import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '../types/product';
import { formatVariantAttributes } from '../utils/productUtils';

// Export the CartItem interface so it can be imported elsewhere
export interface CartItem {
  product: Product;
  variantId: string | null;
  quantity: number;
  variant?: any; // The variant object if a variantId is provided
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Modified to accept either a full CartItem or product + variantId
  const addToCart = (itemOrProduct: CartItem | Product, variantId?: string) => {
    if ('product' in itemOrProduct) {
      // It's already a CartItem, add it directly
      const item = itemOrProduct as CartItem;
      setCartItems(prev => {
        const idx = prev.findIndex(prevItem => 
          prevItem.product.id === item.product.id && 
          prevItem.variantId === item.variantId
        );
        
        if (idx === -1) {
          toast({
            title: "Added to RFQ",
            description: `${item.product.name}${item.variant ? ` (${formatVariantAttributes(item.variant.attributes)})` : ''} has been added to your quote request.`,
          });
          return [...prev, item];
        } else {
          const newCart = [...prev];
          newCart[idx].quantity += item.quantity;
          toast({
            title: "Quantity Increased",
            description: `Increased quantity of ${item.product.name}${item.variant ? ` (${formatVariantAttributes(item.variant.attributes)})` : ''} to ${newCart[idx].quantity}.`,
          });
          return newCart;
        }
      });
    } else {
      // It's a Product object
      const product = itemOrProduct as Product;
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
          return [...prev, { product, quantity: 1, variantId: variantId || null, variant }];
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
    }
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
