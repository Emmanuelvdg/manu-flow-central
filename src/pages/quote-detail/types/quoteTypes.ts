
export interface RFQProductItem {
  id?: number | string;
  name: string;
  quantity?: number;
}

export interface QuoteFormState {
  customerName: string;
  customerEmail: string;
  companyName: string;
  rfqId?: string;
  products: RFQProductItem[];
  status: string;
  total: number;
  paymentTerms: string;
  incoterms: string;
  currency: string;
  shippingMethod: string;
  estimatedDelivery: string;
  riskLevel: string;
  depositPercentage: number;
  quoteNumber: string;
  isSubmitting: boolean;
  isNew: boolean;
  isFormValid: boolean;
  performanceGuarantees: string;
  showPerformanceGuarantees: boolean;
  latePaymentPenalties: string;
  showLatePaymentPenalties: boolean;
  disputeResolutionMethod: string;
  governingLaw: string;
  forceMajeureTerms: string;
  showForceMajeureTerms: boolean;
}

export interface QuoteFormSetters {
  setCustomerName: (value: string) => void;
  setCustomerEmail: (value: string) => void;
  setCompanyName: (value: string) => void;
  setRfqId: (value: string | undefined) => void;
  setProducts: (items: RFQProductItem[]) => void;
  setStatus: (value: string) => void;
  setTotal: (value: number) => void;
  setPaymentTerms: (value: string) => void;
  setIncoterms: (value: string) => void;
  setCurrency: (value: string) => void;
  setShippingMethod: (value: string) => void;
  setEstimatedDelivery: (value: string) => void;
  setRiskLevel: (value: string) => void;
  setDepositPercentage: (value: number) => void;
  setPerformanceGuarantees: (value: string) => void;
  setShowPerformanceGuarantees: (value: boolean) => void;
  setLatePaymentPenalties: (value: string) => void;
  setShowLatePaymentPenalties: (value: boolean) => void;
  setDisputeResolutionMethod: (value: string) => void;
  setGoverningLaw: (value: string) => void;
  setForceMajeureTerms: (value: string) => void;
  setShowForceMajeureTerms: (value: boolean) => void;
}
