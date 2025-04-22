
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable, Column, ColumnCellProps } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus, FileCheck } from 'lucide-react';

// Define the RFQ type
interface RFQ {
  id: string;
  customerName: string;
  date: string;
  products: string[];
  status: string;
  location: string;
  contact: string;
}

// Mock RFQ data
const mockRFQs: RFQ[] = [
  { 
    id: 'RFQ00123', 
    customerName: 'Acme Industries', 
    date: '2025-04-15', 
    products: ['Industrial Pump XL-5000', 'Control Panel CP-2000'], 
    status: 'new',
    location: 'New York, USA',
    contact: 'john.smith@acme.com'
  },
  { 
    id: 'RFQ00124', 
    customerName: 'Global Manufacturing', 
    date: '2025-04-14', 
    products: ['Electric Motor M-Series', 'Pressure Sensor PS-100'], 
    status: 'reviewing',
    location: 'Berlin, Germany',
    contact: 'info@globalmanufacturing.com'
  },
  { 
    id: 'RFQ00125', 
    customerName: 'TechCorp', 
    date: '2025-04-12', 
    products: ['Circuit Board X-54', 'Power Supply 500W'], 
    status: 'quoted',
    location: 'Tokyo, Japan',
    contact: 'orders@techcorp.co.jp'
  },
  { 
    id: 'RFQ00126', 
    customerName: 'Eastern Electronics', 
    date: '2025-04-10', 
    products: ['Control Panel CP-2000', 'Industrial Fan IF-1200'], 
    status: 'completed',
    location: 'Shanghai, China',
    contact: 'purchase@easternelectronics.cn'
  },
];

export const RFQList = () => {
  const navigate = useNavigate();
  const [rfqs, setRFQs] = useState<RFQ[]>(mockRFQs);

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
  const handleAcceptAndCreateQuote = (rfq: RFQ) => {
    // Update local status to 'quoted'
    setRFQs((prevRFQs) =>
      prevRFQs.map((item) =>
        item.id === rfq.id ? { ...item, status: 'quoted' } : item
      )
    );
    // Route to "/quotes/create" and pass the RFQ info via state
    navigate('/quotes/create', {
      state: {
        fromRFQ: {
          rfqId: rfq.id,
          customerName: rfq.customerName,
          products: rfq.products,
          contact: rfq.contact,
          location: rfq.location,
        },
      },
    });
  };

  const columns: Column<RFQ>[] = [
    {
      header: 'RFQ ID',
      accessorKey: 'id',
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (props: ColumnCellProps<RFQ>) => formatDate(props.getValue())
    },
    {
      header: 'Location',
      accessorKey: 'location',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (props: ColumnCellProps<RFQ>) => (
        <StatusBadge status={props.getValue() as any} />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (props: ColumnCellProps<RFQ>) => {
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
        <DataTable 
          columns={columns} 
          data={rfqs} 
          onRowClick={(row) => navigate(`/rfqs/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
};
