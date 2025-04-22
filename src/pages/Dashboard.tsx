import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Package, FileText, ClipboardList, ShoppingCart, Receipt } from 'lucide-react';
import { ProductCatalog } from '@/components/dashboard/ProductCatalog';
import { RFQList } from '@/components/dashboard/RFQList';
import { QuotesList } from '@/components/dashboard/QuotesList';
import { OrdersList } from '@/components/dashboard/OrdersList';
import { InvoiceList } from '@/components/dashboard/InvoiceList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Statistics data
  const stats = {
    products: {
      count: 24,
      onClick: () => navigate('/products'),
      onAdd: () => navigate('/products')
    },
    rfqs: {
      count: 8,
      onClick: () => navigate('/rfqs'),
      onAdd: () => handleAddItem('RFQ')
    },
    quotes: {
      count: 12,
      onClick: () => navigate('/quotes'),
      onAdd: () => handleAddItem('Quote')
    },
    orders: {
      count: 15,
      onClick: () => navigate('/orders'),
      onAdd: () => handleAddItem('Order')
    },
    invoices: {
      count: 10,
      onClick: () => navigate('/invoices'),
      onAdd: () => handleAddItem('Invoice')
    }
  };

  // Get current path to determine which tab should be active
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'products';
  
  // Map routes to tab values
  const getActiveTab = () => {
    switch (path) {
      case 'rfqs':
        return 'rfqs';
      case 'quotes':
        return 'quotes';
      case 'orders':
        return 'orders';
      case 'invoices':
        return 'invoices';
      default:
        return 'products';
    }
  };

  const handleAddItem = (type: string) => {
    toast({
      title: `Add ${type}`,
      description: `Creating a new ${type.toLowerCase()}...`,
    });
    // In a real app, this would navigate to a create form
    // navigate(`/${type.toLowerCase()}/create`);
  };

  // This is the active tab value based on the current route
  const activeTab = getActiveTab();

  return (
    <MainLayout title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard`}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <DashboardCard
            title="Products"
            description="Total available products"
            count={stats.products.count}
            icon={<Package className="h-5 w-5 text-primary" />}
            linkTo="/products"
            color="#1E40AF"
            onClick={stats.products.onClick}
            onAdd={stats.products.onAdd}
          />
          <DashboardCard
            title="RFQs"
            description="Pending quote requests"
            count={stats.rfqs.count}
            icon={<FileText className="h-5 w-5 text-primary" />}
            linkTo="/rfqs"
            color="#6366F1"
            onClick={stats.rfqs.onClick}
            onAdd={stats.rfqs.onAdd}
          />
          <DashboardCard
            title="Quotes"
            description="Active quotes"
            count={stats.quotes.count}
            icon={<ClipboardList className="h-5 w-5 text-primary" />}
            linkTo="/quotes"
            color="#8B5CF6"
            onClick={stats.quotes.onClick}
            onAdd={stats.quotes.onAdd}
          />
          <DashboardCard
            title="Orders"
            description="Current orders"
            count={stats.orders.count}
            icon={<ShoppingCart className="h-5 w-5 text-primary" />}
            linkTo="/orders"
            color="#059669"
            onClick={stats.orders.onClick}
            onAdd={stats.orders.onAdd}
          />
          <DashboardCard
            title="Invoices"
            description="Generated invoices"
            count={stats.invoices.count}
            icon={<Receipt className="h-5 w-5 text-primary" />}
            linkTo="/invoices"
            color="#D97706"
            onClick={stats.invoices.onClick}
            onAdd={stats.invoices.onAdd}
          />
        </div>
        
        <Tabs value={activeTab} defaultValue={activeTab}>
          <TabsList className="w-full justify-start border-b pb-px">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="rfqs">RFQs</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-6">
            <ProductCatalog />
          </TabsContent>
          <TabsContent value="rfqs" className="mt-6">
            <RFQList />
          </TabsContent>
          <TabsContent value="quotes" className="mt-6">
            <QuotesList />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <OrdersList />
          </TabsContent>
          <TabsContent value="invoices" className="mt-6">
            <InvoiceList />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
