import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable, Column, ColumnCellProps } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus, FileCheck } from 'lucide-react';
import { fetchRFQs } from "@/integrations/supabase/rfq";
import { useQuery } from "@tanstack/react-query";

export const RFQList = () => {
  const navigate = useNavigate();
  // Remove local mockRFQs, use Supabase data
  const { data: rfqs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['rfqs'],
    queryFn: fetchRFQs,
  });

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

  // Handler to accept and create quote from an RFQ
  const handleAcceptAndCreateQuote = (rfq: any) => {
    // Update local status to 'quoted'
    // setRFQs((prevRFQs) =>
    //   prevRFQs.map((item) =>
    //     item.id === rfq.id ? { ...item, status: 'quoted' } : item
    //   )
    // );
    // Route to "/quotes/create" and pass the RFQ info via state
    navigate('/quotes/create', {
      state: {
        fromRFQ: {
          rfqId: rfq.id,
          customerName: rfq.customer_name,
          products: rfq.products,
          contact: rfq.customer_email,
          location: rfq.location,
        },
      },
    });
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
            {(row.status === 'new' || row.status === 'reviewing') && (
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
