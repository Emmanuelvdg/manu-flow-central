
import React from 'react';
import { User, Building2, Mail } from 'lucide-react';

interface QuoteCustomerProps {
  customerName?: string;
  customerEmail?: string;
  companyName?: string;
}

export const QuoteCustomer: React.FC<QuoteCustomerProps> = ({
  customerName,
  customerEmail,
  companyName
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Customer Information</h3>
      
      <div className="space-y-3">
        {customerName && (
          <div className="flex items-start">
            <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{customerName}</p>
            </div>
          </div>
        )}
        
        {companyName && (
          <div className="flex items-start">
            <Building2 className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm">{companyName}</p>
            </div>
          </div>
        )}
        
        {customerEmail && (
          <div className="flex items-start">
            <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
            <div>
              <a href={`mailto:${customerEmail}`} className="text-sm text-blue-600 hover:underline">
                {customerEmail}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
