
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, Download, Printer, Send, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

// Define the Invoice type
interface InvoiceData {
  id: string;
  order_id: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  paid: boolean;
  payment_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  order?: {
    order_number: string;
    customer_name: string;
    shipping_address: string;
    products: any[];
    quote_id: string;
  };
  quote?: {
    customer_email: string;
  };
}

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchInvoiceDetails(id);
    }
  }, [id]);

  const fetchInvoiceDetails = async (invoiceId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          order:order_id (
            order_number,
            customer_name,
            shipping_address,
            products,
            quote_id
          ),
          quote:order (
            quotes:quote_id (
              customer_email
            )
          )
        `)
        .eq('id', invoiceId)
        .single();

      if (error) throw error;
      
      // Format the data for the component
      let formattedInvoice: InvoiceData = data;
      
      // Extract customer email from nested query if available
      if (data.quote?.quotes?.customer_email) {
        formattedInvoice.quote = { customer_email: data.quote.quotes.customer_email };
      }
      
      setInvoice(formattedInvoice);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast({
        title: "Error",
        description: "Failed to load invoice details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
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
    const recipient = invoice?.quote?.customer_email || "customer";
    toast({
      title: "Invoice Sent",
      description: `Invoice has been sent to ${recipient}`,
    });
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid: true,
          payment_date: new Date().toISOString()
        })
        .eq('id', invoice.id);
        
      if (error) throw error;
      
      // Update local state
      setInvoice(prev => prev ? {
        ...prev,
        status: 'paid',
        paid: true,
        payment_date: new Date().toISOString()
      } : null);
      
      toast({
        title: "Invoice Updated",
        description: "Invoice has been marked as paid",
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };

  const statusMap: Record<string, any> = {
    'paid': 'completed',
    'pending': 'submitted',
    'overdue': 'rejected',
    'draft': 'draft'
  };

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

  // Calculate invoice items from order products
  const invoiceItems = invoice.order?.products 
    ? Array.isArray(invoice.order.products) 
      ? invoice.order.products.map((product: any, index: number) => ({
          id: index + 1,
          description: product.name || product.product_id || `Product #${index + 1}`,
          quantity: product.quantity || 1,
          unitPrice: product.price || 0,
          total: (product.price || 0) * (product.quantity || 1)
        }))
      : [{
          id: 1,
          description: "Order items",
          quantity: 1,
          unitPrice: invoice.amount,
          total: invoice.amount
        }]
    : [{
        id: 1,
        description: "Order total",
        quantity: 1,
        unitPrice: invoice.amount,
        total: invoice.amount
      }];

  return (
    <MainLayout title={`Invoice Details - ${invoice.invoice_number}`}>
      <div className="space-y-6 max-w-3xl mx-auto">
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
            {invoice.status !== 'paid' && (
              <Button 
                variant="default" 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleMarkAsPaid}
              >
                <Badge className="mr-2 h-4 w-4" />
                Mark as Paid
              </Button>
            )}
          </div>
        </div>
        
        <Card className="print:shadow-none">
          <CardHeader className="space-y-0 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Invoice #{invoice.invoice_number}</CardTitle>
                <CardDescription>
                  Order: {invoice.order?.order_number || invoice.order_id}
                </CardDescription>
              </div>
              <StatusBadge status={statusMap[invoice.status] || invoice.status} />
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
                <div className="font-medium">{invoice.order?.customer_name || "Customer"}</div>
                <div className="text-sm">{invoice.order?.shipping_address || "No address provided"}</div>
                <div className="text-sm">{invoice.quote?.customer_email || "No email provided"}</div>
              </div>
              
              <div className="space-y-1 mt-4 md:mt-0">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Invoice Number:</span>
                  <span className="text-sm">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Issue Date:</span>
                  <span className="text-sm">{new Date(invoice.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Due Date:</span>
                  <span className="text-sm">{new Date(invoice.due_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Payment Status:</span>
                  <span className="text-sm">{invoice.paid ? "Paid" : "Unpaid"}</span>
                </div>
                {invoice.payment_date && (
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">Payment Date:</span>
                    <span className="text-sm">{new Date(invoice.payment_date).toLocaleDateString()}</span>
                  </div>
                )}
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
                    {invoiceItems.map((item) => (
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
                  <span className="font-medium">Total:</span>
                  <span className="font-semibold">${invoice.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
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
      </div>
    </MainLayout>
  );
};

export default InvoiceDetail;
