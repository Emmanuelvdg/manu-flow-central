
import React from 'react';
import { Truck, Calendar, Banknote, Globe } from 'lucide-react';

interface QuoteTermsProps {
  paymentTerms?: string;
  shippingMethod?: string;
  incoterms?: string;
  estimatedDelivery?: string;
}

export const QuoteTerms: React.FC<QuoteTermsProps> = ({
  paymentTerms,
  shippingMethod,
  incoterms,
  estimatedDelivery
}) => {
  return (
    <div className="space-y-3">
      {shippingMethod && (
        <div className="flex items-start">
          <Truck className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Shipping Method</p>
            <p className="text-sm">{shippingMethod}</p>
          </div>
        </div>
      )}
      
      {incoterms && (
        <div className="flex items-start">
          <Globe className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Incoterms</p>
            <p className="text-sm">{incoterms}</p>
          </div>
        </div>
      )}
      
      {paymentTerms && (
        <div className="flex items-start">
          <Banknote className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Payment Terms</p>
            <p className="text-sm">{paymentTerms}</p>
          </div>
        </div>
      )}
      
      {estimatedDelivery && (
        <div className="flex items-start">
          <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Estimated Delivery</p>
            <p className="text-sm">{estimatedDelivery}</p>
          </div>
        </div>
      )}
      
      {!shippingMethod && !incoterms && !paymentTerms && !estimatedDelivery && (
        <p className="text-sm text-muted-foreground">No shipping information available</p>
      )}
    </div>
  );
};
