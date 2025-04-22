
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable, Column, ColumnCellProps } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, FileCheck, FileX, Plus } from 'lucide-react';

// Define the Quote type
interface Quote {
  id: string;
  rfqId: string;
  customerName: string;
  date: string;
  products: string[];
  status: string;
  total: number;
  paymentTerms: string;
  incoterms: string;
  estimatedDelivery: string;
  risk?: string;
}

// Mock Quotes data
const mockQuotes: Quote[] = [
  { 
    id: 'QT00123', 
    rfqId: 'RFQ00123',
    customerName: 'Acme Industries', 
    date: '2025-04-15', 
    products: ['Industrial Pump XL-5000', 'Control Panel CP-2000'], 
    status: 'seen',
    total: 8000,
    paymentTerms: 'Net 30',
    incoterms: 'EXW',
    estimatedDelivery: '2025-06-15',
    risk: 'Medium'
  },
  { 
    id: 'QT00124', 
    rfqId: 'RFQ00124',
    customerName: 'Global Manufacturing', 
    date: '2025-04-14', 
    products: ['Electric Motor M-Series', 'Pressure Sensor PS-100'], 
    status: 'submitted',
    total: 1670,
    paymentTerms: 'Net 45',
    incoterms: 'CIF',
    estimatedDelivery: '2025-05-28'
  },
  { 
    id: 'QT00125', 
    rfqId: 'RFQ00126',
    customerName: 'Eastern Electronics', 
    date: '2025-04-12', 
    products: ['Control Panel CP-2000', 'Industrial Fan IF-1200'], 
    status: 'accepted',
    total: 4750,
    paymentTerms: 'Net 30',
    incoterms: 'FOB',
    estimatedDelivery: '2025-05-21'
  },
  { 
    id: 'QT00126', 
    rfqId: 'RFQ00126',
    customerName: 'Tech Solutions Inc', 
    date: '2025-04-10', 
    products: ['Robotic Arm RA-3000'], 
    status: 'rejected',
    total: 12500,
    paymentTerms: 'Advance 50%',
    incoterms: 'DDP',
    estimatedDelivery: '2025-06-30'
  },
];

export const QuotesList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);

  const acceptQuote = (quoteId: string) => {
    toast({
      title: "Quote Accepted",
      description: `Quote ${quoteId} has been accepted and converted to an order.`,
    });
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: 'accepted' } : quote
    ));
  };

  const rejectQuote = (quoteId: string) => {
    toast({
      title: "Quote Rejected",
      description: `Quote ${quoteId} has been rejected.`,
      variant: "destructive",
    });
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: 'rejected' } : quote
    ));
  };

  // Safe date formatting function
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(dateString);
    }
  };

  // Safe currency formatting function
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '$0';
    try {
      return `$${value.toLocaleString()}`;
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `$${String(value)}`;
    }
  };

  const columns: Column<Quote>[] = [
    {
      header: 'Quote ID',
      accessorKey: 'id',
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (props: ColumnCellProps<Quote>) => formatDate(props.getValue())
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: (props: ColumnCellProps<Quote>) => formatCurrency(props.getValue())
    },
    {
      header: 'Est. Delivery',
      accessorKey: 'estimatedDelivery',
      cell: (props: ColumnCellProps<Quote>) => formatDate(props.getValue())
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (props: ColumnCellProps<Quote>) => (
        <StatusBadge status={props.getValue() as any} />
      )
    },
    {
      header: 'Risk Level',
      accessorKey: 'risk',
      cell: (props: ColumnCellProps<Quote>) => {
        const risk = props.getValue();
        return (
          <span className={`inline-block px-2 py-1 rounded ${
            risk === 'High' || risk === 'Very High' 
              ? 'bg-red-100 text-red-800' 
              : risk === 'Medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {risk || 'Not calculated'}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (props: ColumnCellProps<Quote>) => {
        const row = props.row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              navigate(`/quotes/${row.id}`);
            }}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            {row.status === 'seen' && (
              <>
                <Button variant="default" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  acceptQuote(row.id);
                }}>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Accept
                </Button>
                <Button variant="destructive" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  rejectQuote(row.id);
                }}>
                  <FileX className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quotes</CardTitle>
        <Button size="sm" onClick={() => navigate('/quotes/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={quotes} 
          onRowClick={(row) => navigate(`/quotes/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
};
