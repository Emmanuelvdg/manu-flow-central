
import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { QuoteDetailCustomerFields } from "./QuoteDetailCustomerFields";
import { QuoteDetailProductsSection } from "./QuoteDetailProductsSection";
import { QuoteShippingSection } from "./components/QuoteShippingSection";
import { QuotePaymentSection } from "./components/QuotePaymentSection";
import { QuoteLegalSection } from "./components/QuoteLegalSection";
import { useQuoteForm } from "./hooks/useQuoteForm";

export interface QuoteDetailFormProps {
  initialData?: any;
}

export const QuoteDetailForm: React.FC<QuoteDetailFormProps> = ({ initialData }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const rfqData = location.state?.fromRFQ;
  const rfqIdForShipment = location.state?.rfqIdForShipment;

  const {
    formState,
    setters,
    handleSave,
    handleSubmitQuote
  } = useQuoteForm({ initialData, id, rfqData, rfqIdForShipment });

  return (
    <div className="space-y-8">
      <QuoteDetailCustomerFields 
        customerName={formState.customerName}
        setCustomerName={setters.setCustomerName}
        customerEmail={formState.customerEmail}
        setCustomerEmail={setters.setCustomerEmail}
        companyName={formState.companyName}
        setCompanyName={setters.setCompanyName}
        rfqId={formState.rfqId || rfqIdForShipment}
      />

      <QuoteDetailProductsSection 
        products={formState.products} 
        setProducts={setters.setProducts}
        customProducts={formState.customProducts}
        setCustomProducts={setters.setCustomProducts}
        total={formState.total}
        setTotal={setters.setTotal}
        currency={formState.currency}
        setCurrency={setters.setCurrency}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuoteShippingSection 
          shippingMethod={formState.shippingMethod}
          setShippingMethod={setters.setShippingMethod}
          incoterms={formState.incoterms}
          setIncoterms={setters.setIncoterms}
          estimatedDelivery={formState.estimatedDelivery}
          setEstimatedDelivery={setters.setEstimatedDelivery}
        />
        
        <QuotePaymentSection 
          paymentTerms={formState.paymentTerms}
          setPaymentTerms={setters.setPaymentTerms}
          depositPercentage={formState.depositPercentage}
          setDepositPercentage={setters.setDepositPercentage}
          riskLevel={formState.riskLevel}
          setRiskLevel={setters.setRiskLevel}
          status={formState.status}
          setStatus={setters.setStatus}
          incoterms={formState.incoterms}
        />
      </div>

      <QuoteLegalSection
        performanceGuarantees={formState.performanceGuarantees}
        setPerformanceGuarantees={setters.setPerformanceGuarantees}
        showPerformanceGuarantees={formState.showPerformanceGuarantees}
        setShowPerformanceGuarantees={setters.setShowPerformanceGuarantees}
        latePaymentPenalties={formState.latePaymentPenalties}
        setLatePaymentPenalties={setters.setLatePaymentPenalties}
        showLatePaymentPenalties={formState.showLatePaymentPenalties}
        setShowLatePaymentPenalties={setters.setShowLatePaymentPenalties}
        disputeResolutionMethod={formState.disputeResolutionMethod}
        setDisputeResolutionMethod={setters.setDisputeResolutionMethod}
        governingLaw={formState.governingLaw}
        setGoverningLaw={setters.setGoverningLaw}
        forceMajeureTerms={formState.forceMajeureTerms}
        setForceMajeureTerms={setters.setForceMajeureTerms}
        showForceMajeureTerms={formState.showForceMajeureTerms}
        setShowForceMajeureTerms={setters.setShowForceMajeureTerms}
      />

      <CardFooter className="px-0 pb-0">
        <div className="w-full flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/quotes")}
            disabled={formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={!formState.isFormValid || formState.isSubmitting}
          >
            {formState.isSubmitting ? "Saving..." : (formState.isNew ? "Create Quote" : "Save Changes")}
          </Button>
          {formState.status === 'draft' && !formState.isNew && (
            <Button 
              type="button" 
              variant="default"
              onClick={handleSubmitQuote}
              disabled={!formState.isFormValid || formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Quote
            </Button>
          )}
        </div>
      </CardFooter>
    </div>
  );
};

export default QuoteDetailForm;
