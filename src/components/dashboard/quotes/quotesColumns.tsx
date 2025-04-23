
import React from 'react';
import { Column, ColumnCellProps } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Quote, formatCurrency, formatDate } from './quoteUtils';
import { QuoteActions } from './QuoteActions';
import { RiskLevelBadge } from './RiskLevelBadge';

export const createQuotesColumns = (refetch: () => void): Column<Quote>[] => [
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
    cell: (props: ColumnCellProps<Quote>) => (
      <RiskLevelBadge risk={props.getValue()} />
    )
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: (props: ColumnCellProps<Quote>) => {
      const row = props.row.original;
      return (
        <QuoteActions 
          quoteId={row.id} 
          status={row.status} 
          onStatusChange={refetch} 
        />
      );
    }
  }
];
