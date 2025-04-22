
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable, Column, ColumnCellProps } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Plus, Download } from 'lucide-react';

// Define the Invoice type
interface Invoice {
  id: string;
  orderId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  status: string;
  total: number;
  paymentMethod: string;
  paymentDate: string | null;
}

// Mock Invoices data
const mockInvoices: Invoice[] = [
  { 
    id: 'INV00123', 
    orderId: 'ORD00126',
    customerName: 'European Motors', 
    issueDate: '2025-04-15', 
    dueDate: '2025-05-15',
    status: 'paid',
    total: 5050,
    paymentMethod: 'Bank Transfer',
    paymentDate: '2025-04-20'
  },
  { 
    id: 'INV00124', 
    orderId: 'ORD00125',
    customerName: 'Quantum Mechanics', 
    issueDate: '2025-04-14', 
    dueDate: '2025-05-14',
    status: 'pending',
    total: 6500,
    paymentMethod: 'Credit Card',
    paymentDate: null
  },
  { 
    id: 'INV00125', 
    orderId: 'ORD00124',
    customerName: 'Acme Industries', 
    issueDate: '2025-04-12', 
    dueDate: '2025-05-12',
    status: 'overdue',
    total: 8000,
    paymentMethod: 'Bank Transfer',
    paymentDate: null
  }
];

export const InvoiceList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  const downloadInvoice = (invoiceId: string) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoiceId} PDF has been generated and downloaded.`,
    });
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice ID',
      accessorKey: 'id',
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Issue Date',
      accessorKey: 'issueDate',
      cell: (props: ColumnCellProps<Invoice>) => formatDate(props.getValue())
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      cell: (props: ColumnCellProps<Invoice>) => formatDate(props.getValue())
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: (props: ColumnCellProps<Invoice>) => {
        const value = props.getValue();
        return typeof value === 'number' ? `$${value.toLocaleString()}` : '$0';
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (props: ColumnCellProps<Invoice>) => {
        const statusMap: Record<string, any> = {
          'paid': 'completed',
          'pending': 'submitted',
          'overdue': 'rejected'
        };
        const status = props.getValue();
        return <StatusBadge status={statusMap[status] || status} />;
      }
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (props: ColumnCellProps<Invoice>) => {
        const row = props.row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              navigate(`/invoices/${row.id}`);
            }}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              downloadInvoice(row.id);
            }}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoices</CardTitle>
        <Button size="sm" onClick={() => navigate('/invoices/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={invoices}
          onRowClick={(row) => navigate(`/invoices/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
};
