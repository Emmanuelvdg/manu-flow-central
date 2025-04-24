import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { QuoteFormState } from "../types/quoteTypes";

interface UseQuoteActionsProps {
  id?: string;
  formState: QuoteFormState;
  setIsSubmitting: (value: string) => void;
  setStatus: (value: string) => void;
}

export const useQuoteActions = ({ 
  id, 
  formState, 
  setIsSubmitting,
  setStatus 
}: UseQuoteActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id || id === "create";

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      const jsonProducts = formState.products.map(product => ({
        name: product.name,
        quantity: product.quantity || 1
      }));
      
      const quoteData = {
        customer_name: formState.customerName,
        customer_email: formState.customerEmail,
        company_name: formState.companyName,
        rfq_id: formState.rfqId,
        products: jsonProducts,
        status: formState.status,
        total: formState.total,
        payment_terms: formState.paymentTerms,
        incoterms: formState.incoterms,
        currency: formState.currency,
        shipping_method: formState.shippingMethod,
        estimated_delivery: formState.estimatedDelivery,
        risk_level: formState.riskLevel,
        deposit_percentage: formState.depositPercentage,
        quote_number: formState.quoteNumber,
        performance_guarantees: formState.showPerformanceGuarantees ? formState.performanceGuarantees : null,
        late_payment_penalties: formState.showLatePaymentPenalties ? formState.latePaymentPenalties : null,
        dispute_resolution_method: formState.disputeResolutionMethod,
        governing_law: formState.governingLaw,
        force_majeure_terms: formState.showForceMajeureTerms ? formState.forceMajeureTerms : null,
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

      if (isNew && formState.rfqId) {
        const shipmentData = {
          rfq_id: formState.rfqId,
          quote_id: quoteId,
          status: 'pending'
        };
        
        await supabase.from("shipments").insert(shipmentData);
      }

      toast({
        title: `Quote ${isNew ? "created" : "updated"} successfully`,
        description: `Quote ${formState.quoteNumber} has been ${isNew ? "created" : "updated"}.`,
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

  const handleSubmitQuote = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("quotes")
        .update({ status: "submitted" })
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Quote submitted successfully",
        description: `Quote ${formState.quoteNumber} has been submitted and is ready for acceptance.`,
      });
      
      setStatus("submitted");
      
      navigate("/quotes");
    } catch (error: any) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Failed to submit quote",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSave,
    handleSubmitQuote
  };
};
