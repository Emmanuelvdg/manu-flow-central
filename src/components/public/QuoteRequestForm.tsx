
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createRFQ } from '@/integrations/supabase/rfq';
import { CartItem } from '@/components/dashboard/ProductCatalog';
import { formatVariantAttributes } from '@/components/dashboard/utils/productUtils';

interface QuoteRequestFormProps {
  cartItems: CartItem[];
  onFormSubmit: () => void;
}

export const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ 
  cartItems, 
  onFormSubmit 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    location: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add products to your quote request.",
        variant: "destructive"
      });
      return;
    }
    
    if (!form.customerName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format products for RFQ
      const formattedProducts = cartItems.map(item => {
        const variantInfo = item.variant 
          ? ` (${formatVariantAttributes(item.variant.attributes)})` 
          : '';
          
        return {
          name: `${item.product.name}${variantInfo}`,
          quantity: item.quantity
        };
      });
      
      await createRFQ({
        rfq_number: `RFQ-${Date.now().toString().substring(6)}`,
        customer_name: form.customerName,
        customer_email: form.customerEmail,
        customer_phone: form.customerPhone,
        company_name: form.companyName,
        location: form.location,
        notes: form.notes,
        products: formattedProducts,
        status: "new"
      });
      
      toast({
        title: "Quote Request Submitted",
        description: "Thank you for your request. We'll be in touch soon.",
      });
      
      onFormSubmit();
      navigate('/public/thank-you');
    } catch (err: any) {
      console.error("Error submitting quote request:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to submit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request a Quote</CardTitle>
        <CardDescription>
          Please provide your details and we'll get back to you with a custom quote.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Name*</Label>
            <Input
              id="customerName"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2">Selected Products:</h3>
            <div className="border rounded-md divide-y">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div key={index} className="p-2 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      {item.variant && (
                        <span className="text-gray-500 ml-1">
                          ({formatVariantAttributes(item.variant.attributes)})
                        </span>
                      )}
                    </div>
                    <span>x {item.quantity}</span>
                  </div>
                ))
              ) : (
                <p className="p-2 text-sm text-gray-500">No products selected</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => navigate('/public')}
          className="w-full sm:w-auto"
        >
          Back to Products
        </Button>
        <Button 
          type="submit" 
          onClick={(e) => {
            e.preventDefault();
            const form = e.currentTarget.closest('form');
            if (form) form.requestSubmit();
          }}
          disabled={isSubmitting || cartItems.length === 0}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit Quote Request"}
        </Button>
      </CardFooter>
    </Card>
  );
};
