
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { Quote, fetchQuotes } from './quotes/quoteUtils';
import { createQuotesColumns } from './quotes/quotesColumns';

export const QuotesList = () => {
  const navigate = useNavigate();
  
  // Use React Query to fetch quotes
  const { data: quotes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });

  // Create columns with refetch callback
  const columns = createQuotesColumns(refetch);

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
