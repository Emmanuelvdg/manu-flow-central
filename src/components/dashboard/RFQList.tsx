
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable, Column, ColumnCellProps } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus, FileCheck } from 'lucide-react';
import { fetchRFQs } from "@/integrations/supabase/rfq";
import { useQuery } from "@tanstack/react-query";
import { useToast } from '@/components/ui/use-toast';

export const RFQList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: rfqs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['rfqs'],
    queryFn: fetchRFQs,
  });

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(dateString);
    }
  };

  const handleAcceptAndCreateQuote = async (rfq: any) => {
    // Process products to ensure they're in the correct format for the quote
    const processedProducts = rfq.products.map((product: any) => ({
      name: product.name || product.toString(),
      quantity: product.quantity || 1
    }));

    // Navigate to the quote creation page with RFQ data
    navigate('/quotes/create', {
      state: {
        fromRFQ: {
          rfqId: rfq.id,
          customerName: rfq.customer_name,
          customerEmail: rfq.customer_email,
          companyName: rfq.company_name,
          products: processedProducts,
          contact: rfq.customer_email,
          location: rfq.location,
          customerPhone: rfq.customer_phone,
          notes: rfq.notes
        },
        // Pass the rfqId to ensure it gets linked in the shipment
        rfqIdForShipment: rfq.id
      },
    });
  };

  // Helper function to check if an RFQ already has associated quotes
  const hasQuotes = (rfq: any): boolean => {
    return rfq.quotes && Array.isArray(rfq.quotes) && rfq.quotes.length > 0;
  };

  const columns: Column<any>[] = [
    {
      header: 'RFQ ID',
      accessorKey: 'rfq_number',
    },
    {
      header: 'Customer',
      accessorKey: 'customer_name',
    },
    {
      header: 'Date',
      accessorKey: 'created_at',
      cell: (props: ColumnCellProps<any>) => formatDate(props.getValue())
    },
    {
      header: 'Location',
      accessorKey: 'location',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (props: ColumnCellProps<any>) => (
        <StatusBadge status={props.getValue() as any} />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (props: ColumnCellProps<any>) => {
        const row = props.row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              navigate(`/rfqs/${row.id}`);
            }}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            {(row.status === 'new' || row.status === 'reviewing') && !hasQuotes(row) && (
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptAndCreateQuote(row);
                }}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Accept &amp; Create Quote
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>RFQs</CardTitle>
        <Button size="sm" onClick={() => navigate('/rfqs/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New RFQ
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-center py-8">Loading RFQs...</div>}
        {error && (
          <div className="text-red-600 text-center py-8">
            Error loading RFQs. Please try again.
          </div>
        )}
        <DataTable 
          columns={columns} 
          data={rfqs} 
          onRowClick={(row) => navigate(`/rfqs/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
};
