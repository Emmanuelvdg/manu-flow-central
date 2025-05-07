
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { InvoiceActions } from './InvoiceActions';

interface InvoiceHeaderProps {
  invoiceId: string;
  status: string;
  recipientEmail?: string;
  onMarkAsPaid: () => Promise<void>;
}

export const InvoiceHeader = ({
  invoiceId,
  status,
  recipientEmail,
  onMarkAsPaid
}: InvoiceHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button variant="outline" size="sm" asChild>
        <Link to="/invoices">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Link>
      </Button>
      
      <InvoiceActions 
        invoiceId={invoiceId} 
        status={status}
        recipientEmail={recipientEmail}
        onMarkAsPaid={onMarkAsPaid}
      />
    </div>
  );
};
