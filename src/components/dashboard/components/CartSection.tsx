
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CartItems } from './cart/CartItems';
import { CartTotal } from './cart/CartTotal';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createRFQ } from '@/integrations/supabase/rfq';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    companyName: '',
    customerPhone: '',
    customerEmail: '',
    location: '',
    notes: ''
  });

  if (cartItems.length === 0) {
    return null;
  }

  const handleCreateRFQ = async () => {
    if (!customerDetails.customerName.trim()) {
      toast({
        title: "Validation Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format products for RFQ creation
      const formattedProducts = cartItems.map(item => {
        const variant = item.variant;
        const variantInfo = variant 
          ? ` (${Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')})`
          : '';
        return `${item.product.name}${variantInfo} x ${item.quantity}`;
      });
      
      // Create RFQ directly
      const rfqData = {
        rfq_number: `RFQ-${Date.now().toString().substring(6)}`,
        customer_name: customerDetails.customerName,
        customer_email: customerDetails.customerEmail,
        customer_phone: customerDetails.customerPhone,
        company_name: customerDetails.companyName,
        location: customerDetails.location,
        notes: customerDetails.notes,
        products: formattedProducts,
        status: "new",
      };
      
      const createdRfq = await createRFQ(rfqData);
      
      toast({
        title: "RFQ Created",
        description: `RFQ ${rfqData.rfq_number} created successfully.`,
      });
      
      // Clear cart after successful submission
      onClearCart();
      
      // Navigate to the RFQ list or detail page
      navigate('/rfqs');
      
    } catch (err: any) {
      console.error("Error creating RFQ:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create RFQ. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total price from cart items
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.variant?.price || item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <CartItems
              items={cartItems}
              onRemoveItem={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
            />
            <Card className="mt-4">
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={customerDetails.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={customerDetails.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    value={customerDetails.customerPhone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={customerDetails.customerEmail}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={customerDetails.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={customerDetails.notes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <CartTotal 
              total={calculateTotal()}
              onClear={onClearCart}
              isSubmitting={isSubmitting}
            />
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={onClearCart} className="flex-1 md:flex-none">
                Clear
              </Button>
              <Button 
                onClick={handleCreateRFQ} 
                className="flex-1 md:flex-none"
                disabled={!customerDetails.customerName.trim() || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create RFQ"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
