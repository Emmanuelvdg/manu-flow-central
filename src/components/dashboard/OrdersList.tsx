
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, PackageCheck, Plus, Truck } from 'lucide-react';

// Mock Orders data
const mockOrders = [
  { 
    id: 'ORD00123', 
    quoteId: 'QT00125',
    customerName: 'Eastern Electronics', 
    date: '2025-04-16', 
    products: ['Control Panel CP-2000', 'Industrial Fan IF-1200'], 
    status: 'submitted',
    total: 4750,
    estimatedDelivery: '2025-05-21',
    shippingAddress: 'Tokyo, Japan',
    recipes: ['CP-2000-RECIPE', 'IF-1200-RECIPE']
  },
  { 
    id: 'ORD00124', 
    quoteId: 'QT00123',
    customerName: 'Acme Industries', 
    date: '2025-04-15', 
    products: ['Industrial Pump XL-5000', 'Control Panel CP-2000'], 
    status: 'processing',
    total: 8000,
    estimatedDelivery: '2025-06-15',
    shippingAddress: 'New York, USA',
    recipes: ['XL-5000-RECIPE', 'CP-2000-RECIPE']
  },
  { 
    id: 'ORD00125', 
    quoteId: 'QT00122',
    customerName: 'Quantum Mechanics', 
    date: '2025-04-14', 
    products: ['Hydraulic System HS-500'], 
    status: 'completed',
    total: 6500,
    estimatedDelivery: '2025-05-30',
    shippingAddress: 'Seattle, USA',
    recipes: ['HS-500-RECIPE']
  },
  { 
    id: 'ORD00126', 
    quoteId: 'QT00121',
    customerName: 'European Motors', 
    date: '2025-04-10', 
    products: ['Electric Motor M-Series', 'Control Panel CP-2000'], 
    status: 'fulfilled',
    total: 5050,
    estimatedDelivery: '2025-05-15',
    shippingAddress: 'Paris, France',
    recipes: ['M-SERIES-RECIPE', 'CP-2000-RECIPE']
  },
];

export const OrdersList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);

  const updateStatus = (orderId: string, newStatus: 'processing' | 'completed' | 'fulfilled') => {
    const statusMessages = {
      processing: "Order is now in production",
      completed: "Order has been completed and ready for shipping",
      fulfilled: "Order has been fulfilled and delivered"
    };
    
    toast({
      title: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      description: statusMessages[newStatus],
    });
    
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const statusActions = (order: typeof mockOrders[0]) => {
    switch(order.status) {
      case 'submitted':
        return (
          <Button variant="default" size="sm" onClick={() => updateStatus(order.id, 'processing')}>
            Start Production
          </Button>
        );
      case 'processing':
        return (
          <Button variant="default" size="sm" onClick={() => updateStatus(order.id, 'completed')}>
            <PackageCheck className="mr-2 h-4 w-4" />
            Mark Completed
          </Button>
        );
      case 'completed':
        return (
          <Button variant="default" size="sm" onClick={() => updateStatus(order.id, 'fulfilled')}>
            <Truck className="mr-2 h-4 w-4" />
            Mark Fulfilled
          </Button>
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      header: 'Order ID',
      accessorKey: 'id',
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row: typeof mockOrders[0]) => new Date(row.date).toLocaleDateString()
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: (row: typeof mockOrders[0]) => `$${row.total.toLocaleString()}`
    },
    {
      header: 'Est. Delivery',
      accessorKey: 'estimatedDelivery',
      cell: (row: typeof mockOrders[0]) => new Date(row.estimatedDelivery).toLocaleDateString()
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: typeof mockOrders[0]) => (
        <StatusBadge status={row.status as any} />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: typeof mockOrders[0]) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {statusActions(row)}
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orders</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={orders} 
          onRowClick={(row) => navigate(`/orders/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
};
