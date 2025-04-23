
import React from 'react';

interface QuoteShippingSectionProps {
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  incoterms: string;
  setIncoterms: (terms: string) => void;
  estimatedDelivery: string;
  setEstimatedDelivery: (delivery: string) => void;
}

export const QuoteShippingSection: React.FC<QuoteShippingSectionProps> = ({
  shippingMethod,
  setShippingMethod,
  incoterms,
  setIncoterms,
  estimatedDelivery,
  setEstimatedDelivery
}) => {
  return (
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
  );
};
