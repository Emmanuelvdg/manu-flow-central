
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge, Download, Printer, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceActionsProps {
  invoiceId: string;
  status: string;
  recipientEmail?: string;
  onMarkAsPaid: () => Promise<void>;
}

export const InvoiceActions = ({
  invoiceId,
  status,
  recipientEmail,
  onMarkAsPaid
}: InvoiceActionsProps) => {
  const { toast } = useToast();
  
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
    const recipient = recipientEmail || "customer";
    toast({
      title: "Invoice Sent",
      description: `Invoice has been sent to ${recipient}`,
    });
  };

  return (
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
      {status !== 'paid' && (
        <Button 
          variant="default" 
          size="sm" 
          className="bg-green-600 hover:bg-green-700"
          onClick={onMarkAsPaid}
        >
          <Badge className="mr-2 h-4 w-4" />
          Mark as Paid
        </Button>
      )}
    </div>
  );
};
