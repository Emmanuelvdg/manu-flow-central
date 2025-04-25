
import React, { useEffect } from 'react';
import { calculateRisk, getRecommendedDeposit } from '@/utils/riskCalculator';

interface QuotePaymentSectionProps {
  paymentTerms: string;
  setPaymentTerms: (terms: string) => void;
  depositPercentage: number;
  setDepositPercentage: (percentage: number) => void;
  riskLevel: string;
  setRiskLevel: (level: string) => void;
  status: string;
  setStatus: (status: string) => void;
  incoterms: string;
}

export const QuotePaymentSection: React.FC<QuotePaymentSectionProps> = ({
  paymentTerms,
  setPaymentTerms,
  depositPercentage,
  setDepositPercentage,
  riskLevel,
  setRiskLevel,
  status,
  setStatus,
  incoterms
}) => {
  const STATUS_OPTIONS = [
    { label: "Draft", value: "draft" },
    { label: "Submitted", value: "submitted" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
  ];

  // Calculate risk level and deposit whenever incoterms or payment terms change
  useEffect(() => {
    const mappedPaymentTerm = paymentTerms === 'open' ? 'open' : 
                             paymentTerms === 'advance' ? 'advance' : 
                             paymentTerms === 'lc' ? 'lc' : '';

    const mappedIncoterm = incoterms === 'cif' ? 'cif' :
                          incoterms === 'ddp' ? 'ddp' :
                          incoterms === 'exw' ? 'exw' :
                          incoterms === 'fob' ? 'fob' : '';

    const calculatedRisk = calculateRisk(mappedIncoterm as any, mappedPaymentTerm as any);
    setRiskLevel(calculatedRisk);
    
    const recommendedDeposit = getRecommendedDeposit(calculatedRisk);
    setDepositPercentage(recommendedDeposit);
  }, [incoterms, paymentTerms, setRiskLevel, setDepositPercentage]);

  return (
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
            className="w-full rounded border p-2 bg-gray-50"
            value={depositPercentage}
            readOnly
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Risk Level</label>
          <input
            type="text"
            className="w-full rounded border p-2 bg-gray-50"
            value={riskLevel || 'Not calculated'}
            readOnly
          />
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
  );
};
