
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { migrateProducts } from "../quoteDetailUtils";
import { RFQProductItem } from "../quoteDetailUtils";

export interface UseQuoteFormProps {
  initialData?: any;
  id?: string;
  rfqData?: any;
  rfqIdForShipment?: string;
}

export const useQuoteForm = ({ initialData, id, rfqData, rfqIdForShipment }: UseQuoteFormProps) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with data if editing or coming from RFQ
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
    } else if (rfqData) {
      setCustomerName(rfqData.customerName || "");
      setCustomerEmail(rfqData.customerEmail || "");
      setCompanyName(rfqData.companyName || "");
      setRfqId(rfqData.rfqId);
      
      if (rfqData.products && Array.isArray(rfqData.products)) {
        setProducts(rfqData.products.map((p: any) => ({
          name: typeof p === 'object' ? p.name : String(p),
          quantity: typeof p === 'object' ? (p.quantity || 1) : 1
        })));
      }
    }
  }, [initialData, rfqData]);

  // Generate quote number for new quotes
  useEffect(() => {
    if (isNew && !quoteNumber) {
      setQuoteNumber(`Q-${Date.now()}`);
    }
  }, [isNew, quoteNumber]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      const jsonProducts = products.map(product => ({
        name: product.name,
        quantity: product.quantity || 1
      }));
      
      const quoteData = {
        customer_name: customerName,
        customer_email: customerEmail,
        company_name: companyName,
        rfq_id: rfqId || rfqIdForShipment,
        products: jsonProducts,
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
      
      let result;
      let quoteId;
      
      if (isNew) {
        result = await supabase.from("quotes").insert(quoteData).select();
        if (result.data && result.data.length > 0) {
          quoteId = result.data[0].id;
        }
      } else {
        result = await supabase
          .from("quotes")
          .update(quoteData)
          .eq("id", id)
          .select();
        quoteId = id;
      }

      if (result.error) {
        throw result.error;
      }

      if (isNew && (rfqId || rfqIdForShipment)) {
        const shipmentData = {
          rfq_id: rfqId || rfqIdForShipment,
          quote_id: quoteId,
          status: 'pending'
        };
        
        await supabase.from("shipments").insert(shipmentData);
      }

      toast({
        title: `Quote ${isNew ? "created" : "updated"} successfully`,
        description: `Quote ${quoteNumber} has been ${isNew ? "created" : "updated"}.`,
      });

      navigate("/quotes");
    } catch (error: any) {
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

  const isFormValid = customerName.trim() !== '' && products.length > 0;

  return {
    formState: {
      customerName,
      customerEmail,
      companyName,
      rfqId,
      products,
      status,
      total,
      paymentTerms,
      incoterms,
      currency,
      shippingMethod,
      estimatedDelivery,
      riskLevel,
      depositPercentage,
      quoteNumber,
      isSubmitting,
      isNew,
      isFormValid
    },
    setters: {
      setCustomerName,
      setCustomerEmail,
      setCompanyName,
      setRfqId,
      setProducts,
      setStatus,
      setTotal,
      setPaymentTerms,
      setIncoterms,
      setCurrency,
      setShippingMethod,
      setEstimatedDelivery,
      setRiskLevel,
      setDepositPercentage
    },
    handleSave
  };
};
