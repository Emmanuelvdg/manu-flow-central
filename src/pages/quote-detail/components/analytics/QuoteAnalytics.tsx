
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "@/components/dashboard/quotes/quoteUtils";
import { ConversionMetrics } from "./ConversionMetrics";
import { SalesFunnelChart } from "./SalesFunnelChart";
import { PriceComparisonChart } from "./PriceComparisonChart";

interface QuoteAnalyticsProps {
  quote: Quote;
}

export const QuoteAnalytics: React.FC<QuoteAnalyticsProps> = ({ quote }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Quote Analytics</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ConversionMetrics quoteId={quote.id} />
        
        <Card>
          <CardHeader>
            <CardTitle>Quote Status</CardTitle>
            <CardDescription>Current status and timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold uppercase text-primary">
              {quote.status}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Created on {new Date(quote.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Info</CardTitle>
            <CardDescription>Details about the customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{quote.customer_name}</div>
            {quote.customer_email && (
              <div className="text-sm text-muted-foreground">{quote.customer_email}</div>
            )}
            {quote.company_name && (
              <div className="text-sm text-muted-foreground">{quote.company_name}</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales Funnel Timeline</CardTitle>
            <CardDescription>Time from RFQ to Quote to Order</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <SalesFunnelChart quoteId={quote.id} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Price Comparison</CardTitle>
            <CardDescription>Quoted vs Final Order Prices</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <PriceComparisonChart quoteId={quote.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
