
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import type { QuoteFormState } from '../types/quoteTypes';

interface UseQuoteActionsProps {
  id?: string;
  formState: QuoteFormState;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setStatus: (status: string) => void;
}

export const useQuoteActions = ({
  id,
  formState,
  setIsSubmitting,
  setStatus
}: UseQuoteActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getConversionData } = useCurrencyConversion();

  const saveCustomProducts = async (quoteId: string, customProducts: QuoteFormState['customProducts']) => {
    // First, fetch existing custom products for this quote
    const { data: existingCustomProducts } = await supabase
      .from('custom_products')
      .select('id, name')
      .eq('quote_id', quoteId);
    
    // Create a map of existing custom products by ID
    const existingCustomProductMap = new Map();
    existingCustomProducts?.forEach(product => {
      existingCustomProductMap.set(product.id, product);
    });
    
    // Determine which products to create, update, or delete
    const productsToCreate = customProducts.filter(p => !p.id);
    const productsToUpdate = customProducts.filter(p => p.id && existingCustomProductMap.has(p.id));
    const productsToDelete = existingCustomProducts?.filter(
      p => !customProducts.some(cp => cp.id === p.id)
    ) || [];
    
    // Delete products that are no longer in the list
    if (productsToDelete.length > 0) {
      await supabase
        .from('custom_products')
        .delete()
        .in('id', productsToDelete.map(p => p.id));
    }
    
    // Create new custom products
    if (productsToCreate.length > 0) {
      await supabase
        .from('custom_products')
        .insert(
          productsToCreate.map(p => ({
            name: p.name,
            description: p.description,
            documents: p.documents,
            quote_id: quoteId
          }))
        );
    }
    
    // Update existing custom products
    for (const product of productsToUpdate) {
      await supabase
        .from('custom_products')
        .update({
          name: product.name,
          description: product.description,
          documents: product.documents
        })
        .eq('id', product.id);
    }
  };

  const handleSave = async () => {
    if (!formState.isFormValid) return;

    setIsSubmitting(true);
    
    try {
      // Get currency conversion data
      const conversionData = getConversionData(formState.total, formState.currency);
      
      // Prepare the quote data
      const quoteData = {
        customer_name: formState.customerName,
        customer_email: formState.customerEmail,
        company_name: formState.companyName,
        products: [
          // Standard products
          ...formState.products.map(p => ({ 
            id: p.id,
            name: p.name, 
            quantity: p.quantity || 1,
            isCustom: false
          })),
          // Custom products - store references in the products array
          ...formState.customProducts.map(cp => ({
            id: cp.id,
            name: cp.name,
            description: cp.description,
            isCustom: true,
            documents: cp.documents
          }))
        ],
        rfq_id: formState.rfqId,
        total: formState.total,
        status: formState.status,
        currency: formState.currency,
        // Add currency conversion fields
        base_total: conversionData.baseAmount,
        exchange_rate: conversionData.exchangeRate,
        conversion_date: conversionData.conversionDate,
        payment_terms: formState.paymentTerms,
        incoterms: formState.incoterms,
        shipping_method: formState.shippingMethod,
        estimated_delivery: formState.estimatedDelivery,
        risk_level: formState.riskLevel,
        deposit_percentage: formState.depositPercentage,
        performance_guarantees: formState.showPerformanceGuarantees ? formState.performanceGuarantees : null,
        late_payment_penalties: formState.showLatePaymentPenalties ? formState.latePaymentPenalties : null,
        dispute_resolution_method: formState.disputeResolutionMethod,
        governing_law: formState.governingLaw,
        force_majeure_terms: formState.showForceMajeureTerms ? formState.forceMajeureTerms : null,
        quote_number: formState.quoteNumber || `Q-${Date.now()}`,
        other_fees: JSON.parse(JSON.stringify(formState.otherFees))
      };

      let quoteId = id;
      
      if (formState.isNew) {
        // Create new quote
        const { data, error } = await supabase
          .from('quotes')
          .insert(quoteData)
          .select('id')
          .single();

        if (error) throw error;
        quoteId = data.id;
        
        // Save custom products with the new quote ID
        await saveCustomProducts(quoteId, formState.customProducts);
        
        toast({
          title: "Success",
          description: "Quote created successfully",
        });
        
        // Redirect to the quote detail page
        navigate(`/quotes/${quoteId}`);
      } else if (quoteId) {
        // Update existing quote
        const { error } = await supabase
          .from('quotes')
          .update(quoteData)
          .eq('id', quoteId);

        if (error) throw error;
        
        // Update custom products
        await saveCustomProducts(quoteId, formState.customProducts);
        
        toast({
          title: "Success",
          description: "Quote updated successfully",
        });
      }

    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitQuote = async () => {
    setIsSubmitting(true);
    try {
      if (!id) return;

      const { error } = await supabase
        .from('quotes')
        .update({ status: 'submitted' })
        .eq('id', id);

      if (error) throw error;

      setStatus('submitted');
      toast({
        title: "Success",
        description: "Quote submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
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
