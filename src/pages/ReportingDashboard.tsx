
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RFQConversionReport } from "@/components/reporting/RFQConversionReport";
import { InventoryReport } from "@/components/reporting/InventoryReport";
import { FinancialReport } from "@/components/reporting/FinancialReport";

const ReportingDashboard = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <MainLayout title="Reporting Dashboard">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Business Analytics</h1>
          <p className="text-muted-foreground">
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
      
      <div className="overflow-x-hidden">
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className={`grid w-full ${windowWidth < 640 ? 'grid-cols-1 gap-2' : 'grid-cols-3'}`}>
            <TabsTrigger value="sales">RFQ to Order Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
            <TabsTrigger value="financial">Financial Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-4 space-y-4">
            <div className="overflow-x-auto">
              <RFQConversionReport dateRange={dateRange} />
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-4 space-y-4">
            <div className="overflow-x-auto">
              <InventoryReport dateRange={dateRange} />
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="mt-4 space-y-4">
            <div className="overflow-x-auto">
              <FinancialReport dateRange={dateRange} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReportingDashboard;
