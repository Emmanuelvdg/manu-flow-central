
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable, Column, ColumnCellProps } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, Plus, Download, FileInvoice } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Define the Invoice type
interface Invoice {
  id: string;
  order_id: string;
  amount: number;
  due_date: string;
  status: string;
  invoice_number: string;
  created_at: string;
  paid: boolean;
  payment_date: string | null;
  order?: {
    customer_name: string;
    order_number: string;
  };
}

export const InvoiceList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          order:order_id (
            customer_name,
            order_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setInvoices(data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (invoiceId: string, invoiceNumber: string) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoiceNumber} PDF has been generated and downloaded.`,
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
      accessorKey: 'invoice_number',
    },
    {
      header: 'Customer',
      accessorKey: 'order.customer_name',
      cell: (props: ColumnCellProps<Invoice>) => {
        return props.row.original.order?.customer_name || 'N/A';
      }
    },
    {
      header: 'Order Number',
      accessorKey: 'order.order_number',
      cell: (props: ColumnCellProps<Invoice>) => {
        return props.row.original.order?.order_number || 'N/A';
      }
    },
    {
      header: 'Issue Date',
      accessorKey: 'created_at',
      cell: (props: ColumnCellProps<Invoice>) => formatDate(props.getValue())
    },
    {
      header: 'Due Date',
      accessorKey: 'due_date',
      cell: (props: ColumnCellProps<Invoice>) => formatDate(props.getValue())
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
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
          'overdue': 'rejected',
          'draft': 'draft'
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
              downloadInvoice(row.id, row.invoice_number);
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
        {loading ? (
          <div className="text-center py-4">Loading invoices...</div>
        ) : (
          <DataTable 
            columns={columns} 
            data={invoices}
            onRowClick={(row) => navigate(`/invoices/${row.id}`)}
          />
        )}
      </CardContent>
    </Card>
  );
};
