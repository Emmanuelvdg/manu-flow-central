
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CompanyInfo } from './CompanyInfo';
import { InvoiceCustomerInfo } from './InvoiceCustomerInfo';
import { InvoiceMetadata } from './InvoiceMetadata';
import { InvoiceItems } from './InvoiceItems';
import { InvoiceItem } from './types';

interface InvoiceDetailCardProps {
  invoiceNumber: string;
  orderNumber: string;
  statusDisplay: string;
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;
  createdAt: string;
  dueDate: string;
  isPaid: boolean;
  paymentDate?: string | null;
  invoiceItems: InvoiceItem[];
  totalAmount: number;
}

export const InvoiceDetailCard = ({
  invoiceNumber,
  orderNumber,
  statusDisplay,
  customerName,
  customerAddress,
  customerEmail,
  createdAt,
  dueDate,
  isPaid,
  paymentDate,
  invoiceItems,
  totalAmount,
}: InvoiceDetailCardProps) => {
  // Map invoice status to a valid StatusBadge type
  const getStatusBadgeType = (status: string) => {
    // Map invoice status strings to valid StatusType values
    const statusMap: Record<string, string> = {
      'paid': 'completed',
      'pending': 'submitted',
      'overdue': 'rejected',
      'draft': 'draft'
    };
    
    // Return the mapped status or default to 'submitted' if not found
    return statusMap[status.toLowerCase()] || 'submitted';
  };
  
  return (
    <Card className="print:shadow-none">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Invoice #{invoiceNumber}</CardTitle>
            <CardDescription>
              Order: {orderNumber}
            </CardDescription>
          </div>
          <StatusBadge status={getStatusBadgeType(statusDisplay) as any} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between">
          <CompanyInfo />
          
          <InvoiceCustomerInfo 
            customerName={customerName}
            customerAddress={customerAddress}
            customerEmail={customerEmail}
          />
          
          <InvoiceMetadata
            invoiceNumber={invoiceNumber}
            createdAt={createdAt}
            dueDate={dueDate}
            isPaid={isPaid}
            paymentDate={paymentDate}
          />
        </div>
        
        <Separator />
        
        <InvoiceItems items={invoiceItems} totalAmount={totalAmount} />
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-semibold">Notes</h3>
          <p className="text-sm text-gray-600">
            Thank you for your business. Please make payment by the due date.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Thank you for your business!
        </div>
      </CardFooter>
    </Card>
  );
};
