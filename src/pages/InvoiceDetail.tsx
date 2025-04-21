
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, Download, Printer, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock invoice data
const mockInvoice = {
  id: 'INV00124',
  orderId: 'ORD00125',
  customerName: 'Quantum Mechanics',
  customerAddress: '789 Quantum Lane, Seattle, WA 98101, USA',
  customerContact: 'richard.feynman@quantum.com',
  issueDate: '2025-04-14',
  dueDate: '2025-05-14',
  status: 'pending',
  total: 6500,
  subtotal: 6000,
  tax: 500,
  paymentMethod: 'Credit Card',
  paymentTerms: 'Net 30',
  items: [
    {
      id: 1,
      description: 'Hydraulic System HS-500',
      quantity: 1,
      unitPrice: 6000,
      total: 6000
    }
  ],
  notes: 'Please make payment by the due date. Thank you for your business!'
};

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // In a real app, you would fetch the invoice data using the ID
  const invoice = mockInvoice;
  
  const handleDownload = () => {
    toast({
      title: "Invoice Downloaded",
      description: "Invoice PDF has been generated and downloaded.",
    });
  };
  
  const handlePrint = () => {
    toast({
      title: "Printing Invoice",
      description: "Sending invoice to printer...",
    });
    window.print();
  };
  
  const handleSend = () => {
    toast({
      title: "Invoice Sent",
      description: `Invoice has been sent to ${invoice.customerContact}`,
    });
  };

  const statusMap: Record<string, any> = {
    'paid': 'completed',
    'pending': 'submitted',
    'overdue': 'rejected'
  };

  return (
    <MainLayout title="Invoice Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link to="/invoices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Link>
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="default" size="sm" onClick={handleSend}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
        
        <Card className="print:shadow-none">
          <CardHeader className="space-y-0 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Invoice #{invoice.id}</CardTitle>
                <CardDescription>Order: {invoice.orderId}</CardDescription>
              </div>
              <StatusBadge status={statusMap[invoice.status]} />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground">From</h3>
                <div className="font-medium">MMRP Manufacturing, Inc.</div>
                <div className="text-sm">123 Factory Lane</div>
                <div className="text-sm">Industrial Park, NY 10001</div>
                <div className="text-sm">accounting@mmrp.com</div>
              </div>
              
              <div className="space-y-1 mt-4 md:mt-0">
                <h3 className="text-sm font-semibold text-muted-foreground">Bill To</h3>
                <div className="font-medium">{invoice.customerName}</div>
                <div className="text-sm">{invoice.customerAddress}</div>
                <div className="text-sm">{invoice.customerContact}</div>
              </div>
              
              <div className="space-y-1 mt-4 md:mt-0">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Invoice Number:</span>
                  <span className="text-sm">{invoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Issue Date:</span>
                  <span className="text-sm">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Due Date:</span>
                  <span className="text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Payment Terms:</span>
                  <span className="text-sm">{invoice.paymentTerms}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-semibold">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Description</th>
                      <th className="text-right py-2 px-2">Quantity</th>
                      <th className="text-right py-2 px-2">Unit Price</th>
                      <th className="text-right py-2 px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-2">{item.description}</td>
                        <td className="text-right py-2 px-2">{item.quantity}</td>
                        <td className="text-right py-2 px-2">${item.unitPrice.toLocaleString()}</td>
                        <td className="text-right py-2 px-2">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <div className="flex justify-between w-full md:w-1/3">
                  <span className="font-medium">Subtotal:</span>
                  <span>${invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-full md:w-1/3">
                  <span className="font-medium">Tax:</span>
                  <span>${invoice.tax.toLocaleString()}</span>
                </div>
                <Separator className="my-2 w-full md:w-1/3" />
                <div className="flex justify-between w-full md:w-1/3">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">${invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Thank you for your business!
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InvoiceDetail;
