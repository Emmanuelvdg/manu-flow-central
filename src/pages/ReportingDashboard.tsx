
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RFQConversionReport } from "@/components/reporting/RFQConversionReport";
import { InventoryReport } from "@/components/reporting/InventoryReport";
import { FinancialReport } from "@/components/reporting/FinancialReport";
import { OrderProcessingReport } from "@/components/reporting/OrderProcessingReport";
import { OrdersOnHandReport } from "@/components/reporting/OrdersOnHandReport";
import { useIsMobile } from "@/hooks/use-mobile";

const ReportingDashboard = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const isMobile = useIsMobile();
  
  return (
    <MainLayout title="Reporting Dashboard">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 sm:px-4 lg:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Business Analytics</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitor key metrics and performance indicators
          </p>
        </div>
        
        <div className="flex space-x-2">
          <select 
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-hidden w-full">
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 gap-2' : 'grid-cols-5'}`}>
            <TabsTrigger value="sales" className="text-xs sm:text-sm">RFQ Analytics</TabsTrigger>
            <TabsTrigger value="inventory" className="text-xs sm:text-sm">Inventory</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs sm:text-sm">Financial</TabsTrigger>
            <TabsTrigger value="processing" className="text-xs sm:text-sm">Order Processing</TabsTrigger>
            <TabsTrigger value="ordersonhand" className="text-xs sm:text-sm">Orders on Hand</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-4">
            <div className="w-full">
              <RFQConversionReport dateRange={dateRange} />
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-4">
            <div className="w-full">
              <InventoryReport dateRange={dateRange} />
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="mt-4">
            <div className="w-full">
              <FinancialReport dateRange={dateRange} />
            </div>
          </TabsContent>
          
          <TabsContent value="processing" className="mt-4">
            <div className="w-full">
              <OrderProcessingReport dateRange={dateRange} />
            </div>
          </TabsContent>
          
          <TabsContent value="ordersonhand" className="mt-4">
            <div className="w-full">
              <OrdersOnHandReport dateRange={dateRange} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReportingDashboard;
