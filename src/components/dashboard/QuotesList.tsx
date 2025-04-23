
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable, Column, ColumnCellProps } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, FileCheck, FileX, Plus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Define the Quote type
interface Quote {
  id: string;
  rfq_id?: string;
  customer_name: string;
  created_at: string;
  products: any[];
  status: string;
  total: number;
  payment_terms?: string;
  incoterms?: string;
  estimated_delivery?: string;
  risk_level?: string;
  quote_number: string;
}

// Fetch quotes from Supabase
const fetchQuotes = async (): Promise<Quote[]> => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const QuotesList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use React Query to fetch quotes
  const { data: quotes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });

  const acceptQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', quoteId);
      
      if (error) throw error;
      
      toast({
        title: "Quote Accepted",
        description: `Quote has been accepted and converted to an order.`,
      });
      
      // Refetch quotes to update the list
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept quote",
        variant: "destructive",
      });
    }
  };

  const rejectQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'rejected' })
        .eq('id', quoteId);
      
      if (error) throw error;
      
      toast({
        title: "Quote Rejected",
        description: `Quote has been rejected.`,
        variant: "destructive",
      });
      
      // Refetch quotes to update the list
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject quote",
        variant: "destructive",
      });
    }
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
      accessorKey: 'quote_number',
    },
    {
      header: 'Customer',
      accessorKey: 'customer_name',
    },
    {
      header: 'Date',
      accessorKey: 'created_at',
      cell: (props: ColumnCellProps<Quote>) => formatDate(props.getValue())
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: (props: ColumnCellProps<Quote>) => formatCurrency(props.getValue())
    },
    {
      header: 'Est. Delivery',
      accessorKey: 'estimated_delivery',
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
      accessorKey: 'risk_level',
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
            {row.status === 'submitted' && (
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
        {isLoading && <div className="text-center py-8">Loading quotes...</div>}
        {error && (
          <div className="text-red-600 text-center py-8">
            Error loading quotes. Please try again.
          </div>
        )}
        <DataTable 
          columns={columns} 
          data={quotes} 
          onRowClick={(row) => navigate(`/quotes/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
};
