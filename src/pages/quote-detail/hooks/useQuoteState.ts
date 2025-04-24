
import { useState, useEffect } from "react";
import type { QuoteFormState, QuoteFormSetters, RFQProductItem } from "../types/quoteTypes";
import { migrateProducts } from "../quoteDetailUtils";

interface UseQuoteStateProps {
  initialData?: any;
  rfqData?: any;
  isNew: boolean;
}

export const useQuoteState = ({ initialData, rfqData, isNew }: UseQuoteStateProps): [QuoteFormState, QuoteFormSetters] => {
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
  const [performanceGuarantees, setPerformanceGuarantees] = useState("");
  const [showPerformanceGuarantees, setShowPerformanceGuarantees] = useState(false);
  const [latePaymentPenalties, setLatePaymentPenalties] = useState("");
  const [showLatePaymentPenalties, setShowLatePaymentPenalties] = useState(false);
  const [disputeResolutionMethod, setDisputeResolutionMethod] = useState("arbitration");
  const [governingLaw, setGoverningLaw] = useState("");
  const [forceMajeureTerms, setForceMajeureTerms] = useState("");
  const [showForceMajeureTerms, setShowForceMajeureTerms] = useState(false);

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
      setPerformanceGuarantees(initialData.performance_guarantees || "");
      setShowPerformanceGuarantees(!!initialData.performance_guarantees);
      setLatePaymentPenalties(initialData.late_payment_penalties || "");
      setShowLatePaymentPenalties(!!initialData.late_payment_penalties);
      setDisputeResolutionMethod(initialData.dispute_resolution_method || "arbitration");
      setGoverningLaw(initialData.governing_law || "");
      setForceMajeureTerms(initialData.force_majeure_terms || "");
      setShowForceMajeureTerms(!!initialData.force_majeure_terms);
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

  useEffect(() => {
    if (isNew && !quoteNumber) {
      setQuoteNumber(`Q-${Date.now()}`);
    }
  }, [isNew, quoteNumber]);

  const isFormValid = customerName.trim() !== '' && products.length > 0;

  const formState: QuoteFormState = {
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
    isFormValid,
    performanceGuarantees,
    showPerformanceGuarantees,
    latePaymentPenalties,
    showLatePaymentPenalties,
    disputeResolutionMethod,
    governingLaw,
    forceMajeureTerms,
    showForceMajeureTerms
  };

  const setters: QuoteFormSetters = {
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
    setDepositPercentage,
    setIsSubmitting,
    setPerformanceGuarantees,
    setShowPerformanceGuarantees,
    setLatePaymentPenalties,
    setShowLatePaymentPenalties,
    setDisputeResolutionMethod,
    setGoverningLaw,
    setForceMajeureTerms,
    setShowForceMajeureTerms
  };

  return [formState, setters];
};
