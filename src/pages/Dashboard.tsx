
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Package, FileText, ClipboardList, ShoppingCart, Receipt } from 'lucide-react';
import { ProductCatalog } from '@/components/dashboard/ProductCatalog';
import { RFQList } from '@/components/dashboard/RFQList';
import { QuotesList } from '@/components/dashboard/QuotesList';
import { OrdersList } from '@/components/dashboard/OrdersList';
import { InvoiceList } from '@/components/dashboard/InvoiceList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  // Statistics data
  const stats = {
    products: 24,
    rfqs: 8,
    quotes: 12,
    orders: 15,
    invoices: 10
  };
  
  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <DashboardCard
            title="Products"
            description="Total available products"
            count={stats.products}
            icon={<Package className="h-5 w-5 text-primary" />}
            linkTo="/products"
            color="#1E40AF" // primary
          />
          <DashboardCard
            title="RFQs"
            description="Pending quote requests"
            count={stats.rfqs}
            icon={<FileText className="h-5 w-5 text-primary" />}
            linkTo="/rfqs"
            color="#6366F1" // indigo
          />
          <DashboardCard
            title="Quotes"
            description="Active quotes"
            count={stats.quotes}
            icon={<ClipboardList className="h-5 w-5 text-primary" />}
            linkTo="/quotes"
            color="#8B5CF6" // violet
          />
          <DashboardCard
            title="Orders"
            description="Current orders"
            count={stats.orders}
            icon={<ShoppingCart className="h-5 w-5 text-primary" />}
            linkTo="/orders"
            color="#059669" // emerald
          />
          <DashboardCard
            title="Invoices"
            description="Generated invoices"
            count={stats.invoices}
            icon={<Receipt className="h-5 w-5 text-primary" />}
            linkTo="/invoices"
            color="#D97706" // amber
          />
        </div>
        
        <Tabs defaultValue="products">
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
