
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuoteDetailCustomerFields } from "./QuoteDetailCustomerFields";
import { QuoteDetailProductsSection } from "./QuoteDetailProductsSection";
import { migrateProducts, RFQProductItem } from "./quoteDetailUtils";
import { Json } from "@/integrations/supabase/types";

// Import status options for quotes
const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Submitted", value: "submitted" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

export interface QuoteDetailFormProps {
  initialData?: any;
}

export const QuoteDetailForm: React.FC<QuoteDetailFormProps> = ({ initialData }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id || id === "create";

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [rfqId, setRfqId] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<RFQProductItem[]>([]);
  const [status, setStatus] = useState("draft");
  const [total, setTotal] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState("open");
  const [incoterms, setIncoterms] = useState("exw");
  const [currency, setCurrency] = useState("USD");
  const [shippingMethod, setShippingMethod] = useState("sea");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [riskLevel, setRiskLevel] = useState("Low");
  const [depositPercentage, setDepositPercentage] = useState(30);
  const [quoteNumber, setQuoteNumber] = useState("");

  // Loading state 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customer_name || "");
      setCustomerEmail(initialData.customer_email || "");
      setCompanyName(initialData.company_name || "");
      setRfqId(initialData.rfq_id);
      setProducts(migrateProducts(initialData.products) || []);
      setStatus(initialData.status || "draft");
      setTotal(initialData.total || 0);
      setPaymentTerms(initialData.payment_terms || "open");
      setIncoterms(initialData.incoterms || "exw");
      setCurrency(initialData.currency || "USD");
      setShippingMethod(initialData.shipping_method || "sea");
      setEstimatedDelivery(initialData.estimated_delivery || "");
      setRiskLevel(initialData.risk_level || "Low");
      setDepositPercentage(initialData.deposit_percentage || 30);
      setQuoteNumber(initialData.quote_number || "");
    }
  }, [initialData]);

  // Generate quote number for new quotes
  useEffect(() => {
    if (isNew && !quoteNumber) {
      setQuoteNumber(`Q-${Date.now()}`);
    }
  }, [isNew, quoteNumber]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      // Convert RFQProductItem[] to Json compatible format
      const jsonProducts = products.map(product => ({
        name: product.name,
        quantity: product.quantity || 1
      }));
      
      // Prepare quote data
      const quoteData = {
        customer_name: customerName,
        customer_email: customerEmail,
        company_name: companyName,
        rfq_id: rfqId,
        products: jsonProducts as unknown as Json,
        status,
        total,
        payment_terms: paymentTerms,
        incoterms,
        currency,
        shipping_method: shippingMethod,
        estimated_delivery: estimatedDelivery,
        risk_level: riskLevel,
        deposit_percentage: depositPercentage,
        quote_number: quoteNumber,
      };
      
      console.log("Saving quote:", quoteData);

      // Insert or update the quote in Supabase
      let result;
      
      if (isNew) {
        // Create new quote
        result = await supabase.from("quotes").insert(quoteData);
      } else {
        // Update existing quote
        result = await supabase
          .from("quotes")
          .update(quoteData)
          .eq("id", id);
      }

      // Handle errors
      if (result.error) {
        throw result.error;
      }

      // Show success message
      toast({
        title: `Quote ${isNew ? "created" : "updated"} successfully`,
        description: `Quote ${quoteNumber} has been ${isNew ? "created" : "updated"}.`,
      });

      // Redirect to quotes list
      navigate("/quotes");
    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        title: "Failed to save quote",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <QuoteDetailCustomerFields 
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerEmail={customerEmail}
        setCustomerEmail={setCustomerEmail}
        companyName={companyName}
        setCompanyName={setCompanyName}
        rfqId={rfqId}
      />

      <QuoteDetailProductsSection 
        products={products} 
        setProducts={setProducts} 
        total={total}
        setTotal={setTotal}
        currency={currency}
        setCurrency={setCurrency}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="font-medium">Shipping & Delivery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Method</label>
              <select 
                className="w-full rounded border p-2" 
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                <option value="sea">Sea</option>
                <option value="air">Air</option>
                <option value="land">Land</option>
                <option value="express">Express</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Incoterms</label>
              <select 
                className="w-full rounded border p-2"
                value={incoterms}
                onChange={(e) => setIncoterms(e.target.value)}
              >
                <option value="exw">EXW (Ex Works)</option>
                <option value="fob">FOB (Free on Board)</option>
                <option value="cif">CIF (Cost, Insurance, Freight)</option>
                <option value="ddp">DDP (Delivered Duty Paid)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Delivery</label>
            <input 
              type="text" 
              className="w-full rounded border p-2"
              placeholder="e.g., 4-6 weeks"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Payment & Terms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Terms</label>
              <select 
                className="w-full rounded border p-2"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              >
                <option value="open">Open Account (Net 30)</option>
                <option value="cod">Cash on Delivery</option>
                <option value="advance">Advance Payment</option>
                <option value="lc">Letter of Credit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deposit (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100"
                className="w-full rounded border p-2"
                value={depositPercentage}
                onChange={(e) => setDepositPercentage(parseInt(e.target.value || "0"))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Risk Level</label>
              <select 
                className="w-full rounded border p-2"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="w-full rounded border p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <CardFooter className="px-0 pb-0">
        <div className="w-full flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/quotes")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={!customerName || products.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Saving..." : (isNew ? "Create Quote" : "Save Changes")}
          </Button>
        </div>
      </CardFooter>
    </div>
  );
};
