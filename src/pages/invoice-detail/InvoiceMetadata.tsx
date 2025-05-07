
import React from 'react';

interface InvoiceMetadataProps {
  invoiceNumber: string;
  createdAt: string;
  dueDate: string;
  isPaid: boolean;
  paymentDate?: string | null;
}

export const InvoiceMetadata = ({
  invoiceNumber,
  createdAt,
  dueDate,
  isPaid,
  paymentDate
}: InvoiceMetadataProps) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Invoice Number:</span>
        <span className="text-sm">{invoiceNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Issue Date:</span>
        <span className="text-sm">{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Due Date:</span>
        <span className="text-sm">{new Date(dueDate).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-semibold text-muted-foreground">Payment Status:</span>
        <span className="text-sm">{isPaid ? "Paid" : "Unpaid"}</span>
      </div>
      {paymentDate && (
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-muted-foreground">Payment Date:</span>
          <span className="text-sm">{new Date(paymentDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};
