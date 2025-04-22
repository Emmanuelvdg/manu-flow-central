
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Plus, Download } from 'lucide-react';

// Mock Invoices data
const mockInvoices = [
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
  const [invoices, setInvoices] = useState(mockInvoices);

  const downloadInvoice = (invoiceId: string) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoiceId} PDF has been generated and downloaded.`,
    });
  };

  const columns = [
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
      cell: (row: typeof mockInvoices[0]) => new Date(row.issueDate).toLocaleDateString()
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      cell: (row: typeof mockInvoices[0]) => new Date(row.dueDate).toLocaleDateString()
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: (row: typeof mockInvoices[0]) => `$${row.total.toLocaleString()}`
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: typeof mockInvoices[0]) => {
        const statusMap: Record<string, any> = {
          'paid': 'completed',
          'pending': 'submitted',
          'overdue': 'rejected'
        };
        return <StatusBadge status={statusMap[row.status]} />;
      }
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: typeof mockInvoices[0]) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/invoices/${row.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadInvoice(row.id)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      )
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
