
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createInvoiceFromOrder, checkInvoiceExistsForOrder } from "@/services/invoiceService";

interface InvoiceButtonProps {
  orderId: string;
  allProductsCompleted: boolean;
}

export const InvoiceButton: React.FC<InvoiceButtonProps> = ({
  orderId,
  allProductsCompleted
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [invoiceExists, setInvoiceExists] = useState(false);

  // Check if an invoice already exists for this order
  useEffect(() => {
    const checkInvoice = async () => {
      const exists = await checkInvoiceExistsForOrder(orderId);
      setInvoiceExists(exists);
    };
    
    if (allProductsCompleted) {
      checkInvoice();
    }
  }, [orderId, allProductsCompleted]);

  const handleCreateInvoice = async () => {
    try {
      setCreatingInvoice(true);
      const invoice = await createInvoiceFromOrder(orderId);
      
      if (invoice) {
        toast({
          title: "Invoice Created",
          description: `Invoice #${invoice.invoice_number} has been created.`,
        });
        setInvoiceExists(true);
        // Navigate to the invoice detail page
        navigate(`/invoices/${invoice.id}`);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    } finally {
      setCreatingInvoice(false);
    }
  };

  if (!allProductsCompleted) {
    return null;
  }

  return (
    <Button
      onClick={handleCreateInvoice}
      disabled={creatingInvoice || invoiceExists}
      variant={invoiceExists ? "outline" : "default"}
      className="gap-2 bg-blue-600 hover:bg-blue-700"
    >
      <FileText className="h-4 w-4" />
      {invoiceExists 
        ? 'Already Invoiced' 
        : creatingInvoice 
          ? 'Creating Invoice...' 
          : 'Create Invoice'}
    </Button>
  );
};
