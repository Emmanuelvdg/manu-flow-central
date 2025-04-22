
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Plus, FileDown } from 'lucide-react';

// Mock RFQ data
const mockRFQs = [
  { 
    id: 'RFQ00123', 
    customerName: 'Acme Industries', 
    date: '2025-04-15', 
    products: ['Industrial Pump XL-5000', 'Control Panel CP-2000'], 
    status: 'submitted',
    location: 'New York, USA',
    contact: 'john.doe@acme.com'
  },
  { 
    id: 'RFQ00124', 
    customerName: 'Global Manufacturing', 
    date: '2025-04-14', 
    products: ['Electric Motor M-Series', 'Pressure Sensor PS-100'], 
    status: 'submitted',
    location: 'London, UK',
    contact: 'sarah.smith@global.com'
  },
  { 
    id: 'RFQ00125', 
    customerName: 'Tech Solutions Inc', 
    date: '2025-04-12', 
    products: ['Robotic Arm RA-3000'], 
    status: 'draft',
    location: 'Berlin, Germany',
    contact: 'hans.mueller@techsol.com'
  },
  { 
    id: 'RFQ00126', 
    customerName: 'Eastern Electronics', 
    date: '2025-04-10', 
    products: ['Control Panel CP-2000', 'Industrial Fan IF-1200'], 
    status: 'submitted',
    location: 'Tokyo, Japan',
    contact: 'takashi.yamamoto@eastern.jp'
  },
];

export const RFQList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rfqs, setRfqs] = useState(mockRFQs);

  const createQuote = (rfqId: string) => {
    toast({
      title: "Quote Created",
      description: `Quote for RFQ ${rfqId} has been created and sent.`,
    });
    setRfqs(rfqs.map(rfq => 
      rfq.id === rfqId ? { ...rfq, status: 'processed' as 'submitted' } : rfq
    ));
  };

  const columns = [
    {
      header: 'RFQ ID',
      accessorKey: 'id',
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Location',
      accessorKey: 'location',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row: typeof mockRFQs[0]) => new Date(row.date).toLocaleDateString()
    },
    {
      header: 'Products',
      accessorKey: 'products',
      cell: (row: typeof mockRFQs[0]) => (
        <div className="max-w-xs truncate" title={row.products.join(', ')}>
          {row.products.join(', ')}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: typeof mockRFQs[0]) => (
        <StatusBadge status={row.status as any} />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: typeof mockRFQs[0]) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/rfqs/${row.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {row.status === 'submitted' && (
            <Button variant="default" size="sm" onClick={() => createQuote(row.id)}>
              <FileDown className="mr-2 h-4 w-4" />
              Create Quote
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Request for Quotations</CardTitle>
        <Button size="sm" onClick={() => navigate('/rfqs/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New RFQ
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={rfqs} 
          onRowClick={(row) => navigate(`/rfqs/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
};
