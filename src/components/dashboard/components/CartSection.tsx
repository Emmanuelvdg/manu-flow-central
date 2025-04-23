
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createRFQ } from '@/integrations/supabase/rfq';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CartItem } from '../ProductCatalog';

interface CartSectionProps {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
}

export const CartSection: React.FC<CartSectionProps> = ({
  cartItems,
  onRemoveItem,
  onClearCart,
  onUpdateQuantity
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rfqFields, setRFQFields] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    company_name: '',
    location: '',
    notes: '',
  });

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRFQFields(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmitRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast({
        title: "Empty RFQ",
        description: "Please add products to your quote request.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Generate a unique RFQ number (you might want to implement a more robust method)
      const rfq_number = `RFQ-${Date.now()}`;
      
      await createRFQ({
        ...rfqFields,
        rfq_number,
        products: cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity
        })),
        status: 'new'
      });

      toast({
        title: "RFQ Created",
        description: `RFQ ${rfq_number} created successfully.`,
      });

      // Clear cart and navigate to RFQ list
      onClearCart();
      navigate('/rfqs');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request for Quotation (RFQ)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitRFQ} className="space-y-4">
          {/* RFQ Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="customer_name"
              placeholder="Customer Name"
              value={rfqFields.customer_name}
              onChange={handleFieldChange}
              required
            />
            <Input
              name="customer_email"
              placeholder="Customer Email"
              type="email"
              value={rfqFields.customer_email}
              onChange={handleFieldChange}
            />
            <Input
              name="customer_phone"
              placeholder="Customer Phone"
              value={rfqFields.customer_phone}
              onChange={handleFieldChange}
            />
            <Input
              name="company_name"
              placeholder="Company Name"
              value={rfqFields.company_name}
              onChange={handleFieldChange}
            />
            <Input
              name="location"
              placeholder="Location"
              value={rfqFields.location}
              onChange={handleFieldChange}
            />
          </div>
          
          <Textarea
            name="notes"
            placeholder="Additional Notes"
            value={rfqFields.notes}
            onChange={handleFieldChange}
          />

          {/* Cart Items Display */}
          <div className="border rounded p-4 mt-4">
            <h3 className="font-semibold mb-2">Products in RFQ</h3>
            {cartItems.map(item => (
              <div 
                key={item.product.id} 
                className="flex justify-between items-center border-b py-2 last:border-b-0"
              >
                <div>
                  <span className="font-medium">{item.product.name}</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  type="button"
                  onClick={() => onRemoveItem(item.product.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClearCart}
            >
              Clear Cart
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit RFQ"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
