
import React from 'react';

interface QuotePaymentSectionProps {
  paymentTerms: string;
  setPaymentTerms: (terms: string) => void;
  depositPercentage: number;
  setDepositPercentage: (percentage: number) => void;
  riskLevel: string;
  setRiskLevel: (level: string) => void;
  status: string;
  setStatus: (status: string) => void;
}

export const QuotePaymentSection: React.FC<QuotePaymentSectionProps> = ({
  paymentTerms,
  setPaymentTerms,
  depositPercentage,
  setDepositPercentage,
  riskLevel,
  setRiskLevel,
  status,
  setStatus
}) => {
  const STATUS_OPTIONS = [
    { label: "Draft", value: "draft" },
    { label: "Submitted", value: "submitted" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
  ];

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
  );
};
