
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LoadingState } from "@/pages/quote-detail/components/LoadingState";

interface RFQConversionReportProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

export const RFQConversionReport: React.FC<RFQConversionReportProps> = ({ dateRange }) => {
  // Calculate date range for filtering
  const calculateDateRange = () => {
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return startDate.toISOString();
  };

  const startDate = calculateDateRange();
  
  // Fetch conversion data
  const { data, isLoading } = useQuery({
    queryKey: ['rfq-conversion', dateRange],
    queryFn: async () => {
      // Get RFQs in date range
      const { data: rfqs } = await supabase
        .from('rfqs')
        .select('id, created_at, customer_name, products')
        .gte('created_at', startDate);
      
      // Get quotes that link to these RFQs
      const { data: quotes } = await supabase
        .from('quotes')
        .select('id, rfq_id, status, created_at');
      
      // Get orders that link to accepted quotes
      const { data: orders } = await supabase
        .from('orders')
        .select('id, quote_id, created_at');
      
      // Map the RFQs, quotes, and orders
      const rfqMap = new Map();
      
      if (rfqs) {
        rfqs.forEach(rfq => {
          rfqMap.set(rfq.id, {
            ...rfq,
            hasQuote: false,
            quoteId: null,
            quoteStatus: null,
            quoteCreatedAt: null,
            hasOrder: false,
            orderId: null,
            orderCreatedAt: null,
            timeToQuote: null,
            timeToOrder: null
          });
        });
      }
      
      // Add quote data
      if (quotes) {
        quotes.forEach(quote => {
          if (quote.rfq_id && rfqMap.has(quote.rfq_id)) {
            const rfq = rfqMap.get(quote.rfq_id);
            rfq.hasQuote = true;
            rfq.quoteId = quote.id;
            rfq.quoteStatus = quote.status;
            rfq.quoteCreatedAt = quote.created_at;
            
            if (rfq.quoteCreatedAt && rfq.created_at) {
              // Calculate days from RFQ to quote
              const rfqDate = new Date(rfq.created_at);
              const quoteDate = new Date(rfq.quoteCreatedAt);
              rfq.timeToQuote = Math.round((quoteDate.getTime() - rfqDate.getTime()) / (1000 * 60 * 60 * 24));
            }
            
            rfqMap.set(quote.rfq_id, rfq);
          }
        });
      }
      
      // Add order data
      if (orders) {
        orders.forEach(order => {
          if (order.quote_id) {
            // Find the RFQ that has this quote
            for (const [rfqId, rfq] of rfqMap.entries()) {
              if (rfq.quoteId === order.quote_id) {
                rfq.hasOrder = true;
                rfq.orderId = order.id;
                rfq.orderCreatedAt = order.created_at;
                
                if (rfq.quoteCreatedAt && rfq.orderCreatedAt) {
                  // Calculate days from quote to order
                  const quoteDate = new Date(rfq.quoteCreatedAt);
                  const orderDate = new Date(rfq.orderCreatedAt);
                  rfq.timeToOrder = Math.round((orderDate.getTime() - quoteDate.getTime()) / (1000 * 60 * 60 * 24));
                }
                
                rfqMap.set(rfqId, rfq);
                break;
              }
            }
          }
        });
      }
      
      // Convert map to array
      const rfqData = Array.from(rfqMap.values());
      
      // Calculate stats
      const totalRfqs = rfqData.length;
      const rfqsWithQuotes = rfqData.filter(rfq => rfq.hasQuote).length;
      const quotesAccepted = rfqData.filter(rfq => rfq.quoteStatus === 'accepted').length;
      const quotesWithOrders = rfqData.filter(rfq => rfq.hasOrder).length;
      
      const conversionRate = totalRfqs > 0 ? (quotesWithOrders / totalRfqs) * 100 : 0;
      
      // Calculate average times
      const rfqsWithTimeToQuote = rfqData.filter(rfq => rfq.timeToQuote !== null);
      const avgTimeToQuote = rfqsWithTimeToQuote.length > 0
        ? rfqsWithTimeToQuote.reduce((sum, rfq) => sum + (rfq.timeToQuote || 0), 0) / rfqsWithTimeToQuote.length
        : 0;
      
      const quotesWithTimeToOrder = rfqData.filter(rfq => rfq.timeToOrder !== null);
      const avgTimeToOrder = quotesWithTimeToOrder.length > 0
        ? quotesWithTimeToOrder.reduce((sum, rfq) => sum + (rfq.timeToOrder || 0), 0) / quotesWithTimeToOrder.length
        : 0;
      
      // Customer analysis
      const customerData = {};
      rfqData.forEach(rfq => {
        const customer = rfq.customer_name || 'Unknown';
        if (!customerData[customer]) {
          customerData[customer] = {
            name: customer,
            rfqs: 0,
            quotes: 0,
            orders: 0
          };
        }
        
        customerData[customer].rfqs++;
        if (rfq.hasQuote) {
          customerData[customer].quotes++;
        }
        if (rfq.hasOrder) {
          customerData[customer].orders++;
        }
      });
      
      // Convert to array for charts
      const customerAnalysis = Object.values(customerData);
      
      return {
        rfqData,
        stats: {
          totalRfqs,
          rfqsWithQuotes,
          quotesAccepted,
          quotesWithOrders,
          conversionRate,
          avgTimeToQuote,
          avgTimeToOrder
        },
        customerAnalysis
      };
    }
  });

  if (isLoading) {
    return <LoadingState message="Loading RFQ conversion data..." />;
  }

  if (!data) {
    return <div className="text-center p-4">No conversion data available</div>;
  }

  const { stats, customerAnalysis } = data;
  
  // Chart configuration
  const chartConfig = {
    rfqs: { theme: { light: "#22c55e", dark: "#22c55e" } },
    quotes: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
    orders: { theme: { light: "#f59e0b", dark: "#f59e0b" } }
  };
  
  // Pie chart data for status
  const pieData = [
    { name: "No Quote", value: stats.totalRfqs - stats.rfqsWithQuotes },
    { name: "Quoted (No Order)", value: stats.rfqsWithQuotes - stats.quotesWithOrders },
    { name: "Ordered", value: stats.quotesWithOrders }
  ];
  
  const COLORS = ['#ff7c7c', '#fac858', '#73d13d'];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">RFQ to Order Conversion Analysis</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRfqs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Days to Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTimeToQuote.toFixed(1)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Days to Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTimeToOrder.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>RFQ Status Distribution</CardTitle>
            <CardDescription>Distribution of RFQs by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Customer Performance</CardTitle>
            <CardDescription>RFQs, Quotes and Orders by Customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerAnalysis.slice(0, 5)}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="rfqs" name="RFQs" fill="#22c55e" />
                    <Bar dataKey="quotes" name="Quotes" fill="#3b82f6" />
                    <Bar dataKey="orders" name="Orders" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
