
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useLocation } from "react-router-dom";
import { createRFQ, RFQInsert } from "@/integrations/supabase/rfq";
import { useToast } from "@/hooks/use-toast";

const RFQCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Initialize form state with cart data if available
  const [fields, setFields] = useState<Omit<RFQInsert, "products">>(() => {
    const cartData = location.state?.customerDetails;
    return {
      rfq_number: `RFQ-${Date.now().toString().substring(6)}`,
      customer_name: cartData?.customerName || "",
      customer_email: cartData?.customerEmail || "",
      customer_phone: cartData?.customerPhone || "",
      company_name: cartData?.companyName || "",
      location: cartData?.location || "",
      notes: cartData?.notes || "",
      status: "new",
    };
  });

  // Initialize products from cart items if available
  const [productsInput, setProductsInput] = useState(() => {
    const cartItems = location.state?.cartItems;
    if (!cartItems) return "";
    return cartItems.map((item: any) => {
      const variant = item.variant;
      const variantInfo = variant ? ` (${Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')})` : '';
      return `${item.product.name}${variantInfo} x ${item.quantity}`;
    }).join(', ');
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fields.customer_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    if (!productsInput.trim()) {
      toast({
        title: "Validation Error",
        description: "At least one product is required",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      await createRFQ({
        ...fields,
        products: productsInput.split(",").map(s => s.trim()),
      });
      toast({
        title: "RFQ Created",
        description: `RFQ ${fields.rfq_number} created successfully.`,
      });
      navigate("/rfqs");
    } catch (err: any) {
      console.error("Error creating RFQ:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create RFQ. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Create RFQ">
      <div className="max-w-lg mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Create New RFQ</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                name="rfq_number"
                placeholder="RFQ Number (unique)"
                value={fields.rfq_number}
                onChange={handleChange}
                required
                disabled
              />
              <Input
                name="customer_name"
                placeholder="Customer Name"
                value={fields.customer_name}
                onChange={handleChange}
                required
              />
              <Input
                name="customer_email"
                placeholder="Customer Email"
                value={fields.customer_email}
                onChange={handleChange}
                type="email"
              />
              <Input
                name="customer_phone"
                placeholder="Customer Phone"
                value={fields.customer_phone}
                onChange={handleChange}
              />
              <Input
                name="company_name"
                placeholder="Company Name"
                value={fields.company_name}
                onChange={handleChange}
              />
              <Input
                name="location"
                placeholder="Location"
                value={fields.location}
                onChange={handleChange}
              />
              <Textarea
                name="notes"
                placeholder="Notes"
                value={fields.notes}
                onChange={handleChange}
                className="min-h-24"
              />
              <Textarea
                placeholder="Products (comma separated)"
                value={productsInput}
                onChange={e => setProductsInput(e.target.value)}
                required
                className="min-h-24"
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" type="button" onClick={() => navigate("/rfqs")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create RFQ"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RFQCreate;
