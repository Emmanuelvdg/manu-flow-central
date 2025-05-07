
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import { InvoiceHeader } from './invoice-detail/InvoiceHeader';
import { InvoiceDetailCard } from './invoice-detail/InvoiceDetailCard';
import { useInvoiceData } from './invoice-detail/hooks/useInvoiceData';
import { useInvoiceItems } from './invoice-detail/hooks/useInvoiceItems';

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading, handleMarkAsPaid } = useInvoiceData(id || '');
  const invoiceItems = useInvoiceItems(invoice);

  if (loading) {
    return (
      <MainLayout title="Invoice Details">
        <div className="max-w-3xl mx-auto mt-8">
          <div className="text-center py-8">Loading invoice details...</div>
        </div>
      </MainLayout>
    );
  }

  if (!invoice) {
    return (
      <MainLayout title="Invoice Details">
        <div className="max-w-3xl mx-auto mt-8">
          <div className="text-center py-8">Invoice not found</div>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Invoice Details - ${invoice?.invoice_number || 'Loading...'}`}>
      <div className="space-y-6 max-w-3xl mx-auto">
        <InvoiceHeader
          invoiceId={invoice.id}
          status={invoice.status}
          recipientEmail={invoice.quote?.customer_email}
          onMarkAsPaid={handleMarkAsPaid}
        />
        
        <InvoiceDetailCard
          invoiceNumber={invoice.invoice_number}
          orderNumber={invoice.order?.order_number || invoice.order_id}
          statusDisplay={invoice.status}
          customerName={invoice.order?.customer_name || "Customer"}
          customerAddress={invoice.order?.shipping_address}
          customerEmail={invoice.quote?.customer_email}
          createdAt={invoice.created_at}
          dueDate={invoice.due_date}
          isPaid={invoice.paid}
          paymentDate={invoice.payment_date}
          invoiceItems={invoiceItems}
          totalAmount={invoice.amount}
        />
      </div>
    </MainLayout>
  );
};

export default InvoiceDetail;
