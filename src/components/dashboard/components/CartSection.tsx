
import React, { useState } from 'react';
import { Trash, X, ShoppingCart, Plus, Minus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CartItem } from '../ProductCatalog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Helper function to format variant attributes for display
const formatVariantAttributes = (attributes: Record<string, string> | null | undefined): string => {
  if (!attributes) return '';
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

const rfqFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email().optional().or(z.literal('')),
  customerPhone: z.string().optional().or(z.literal('')),
  companyName: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

type RfqFormValues = z.infer<typeof rfqFormSchema>;

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

  const form = useForm<RfqFormValues>({
    resolver: zodResolver(rfqFormSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      companyName: '',
      location: '',
      notes: ''
    }
  });

  const handleCreateRFQ = async (formData: RfqFormValues) => {
    if (cartItems.length === 0) return;
    
    setIsCreatingRFQ(true);
    
    try {
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
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "RFQ Created",
        description: `RFQ #${rfqNumber} has been created successfully.`,
      });
      
      onClearCart();
      setIsCartOpen(false);
      navigate(`/rfqs/${data.id}`); // Changed from /rfq/ to /rfqs/ to match route definition
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
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Your quote request is empty
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item, index) => (
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
          )}
        </div>
        
        {cartItems.length > 0 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateRFQ)} className="space-y-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter customer name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Enter email address" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter phone number" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter company name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter location" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Add any notes" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SheetFooter className="pt-4 border-t">
                <div className="w-full space-y-4">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">${totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={onClearCart}
                      disabled={isCreatingRFQ}
                    >
                      Clear All
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreatingRFQ}
                    >
                      {isCreatingRFQ ? "Creating..." : "Create RFQ"}
                    </Button>
                  </div>
                </div>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};
