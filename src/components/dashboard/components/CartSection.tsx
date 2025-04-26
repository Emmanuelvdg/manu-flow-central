
import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '../ProductCatalog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { RFQForm } from './cart/RFQForm';
import { CartItems } from './cart/CartItems';
import { CartTotal } from './cart/CartTotal';
import { z } from 'zod';

interface CartSectionProps {
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onClearCart: () => void;
}

export const CartSection: React.FC<CartSectionProps> = ({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart
}) => {
  const [isCreatingRFQ, setIsCreatingRFQ] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.variant && item.variant.price !== null && item.variant.price !== undefined
      ? item.variant.price
      : item.product.price;
    return sum + (price || 0) * item.quantity;
  }, 0);

  // Define the form schema
  const rfqFormSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email().optional().or(z.literal('')),
    customerPhone: z.string().optional().or(z.literal('')),
    companyName: z.string().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal(''))
  });

  type RfqFormValues = z.infer<typeof rfqFormSchema>;

  const handleCreateRFQ = async (formData: RfqFormValues) => {
    if (cartItems.length === 0) return;
    
    setIsCreatingRFQ(true);
    
    try {
      // Ensure customerName is provided
      if (!formData.customerName || formData.customerName.trim() === '') {
        throw new Error('Customer name is required');
      }
      
      const products = cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.variant?.price || item.product.price,
        variantId: item.variantId,
        variantAttributes: item.variant ? item.variant.attributes : null,
        sku: item.variant ? item.variant.sku : null
      }));
      
      const rfqNumber = `RFQ-${Date.now().toString().substring(6)}`;
      
      const { data, error } = await supabase
        .from('rfqs')
        .insert({
          rfq_number: rfqNumber,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          company_name: formData.companyName,
          location: formData.location,
          notes: formData.notes,
          products,
          status: 'new'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "RFQ Created",
        description: `RFQ #${rfqNumber} has been created successfully.`,
      });
      
      onClearCart();
      setIsCartOpen(false);
      navigate(`/rfqs/${data.id}`);
    } catch (error: any) {
      console.error("Error creating RFQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create RFQ. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingRFQ(false);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-5 right-5 rounded-full w-16 h-16 shadow-lg" size="icon">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 rounded-full px-2">{totalItems}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl">Quote Request ({totalItems} items)</SheetTitle>
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <CartItems 
            items={cartItems}
            onRemoveItem={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
          />
        </div>
        
        {cartItems.length > 0 && (
          <div>
            <RFQForm 
              onSubmit={handleCreateRFQ}
              isSubmitting={isCreatingRFQ}
            />
            <CartTotal 
              total={totalPrice}
              onClear={onClearCart}
              isSubmitting={isCreatingRFQ}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
