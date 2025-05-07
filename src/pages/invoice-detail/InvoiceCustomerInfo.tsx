
import React from 'react';

interface InvoiceCustomerInfoProps {
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;
}

export const InvoiceCustomerInfo = ({
  customerName,
  customerAddress,
  customerEmail
}: InvoiceCustomerInfoProps) => {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-muted-foreground">Bill To</h3>
      <div className="font-medium">{customerName || "Customer"}</div>
      <div className="text-sm">{customerAddress || "No address provided"}</div>
      <div className="text-sm">{customerEmail || "No email provided"}</div>
    </div>
  );
};
