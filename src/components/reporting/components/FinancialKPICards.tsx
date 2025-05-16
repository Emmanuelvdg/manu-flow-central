
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { FinancialData } from "../hooks/useFinancialData";
import { AlertCircle } from "lucide-react";

interface FinancialKPICardsProps {
  data: FinancialData;
}

export const FinancialKPICards: React.FC<FinancialKPICardsProps> = ({ data }) => {
  const { totalOrders, totalRevenue, wipTotal, invoicesPaid, invoicesUnpaid } = data;
  
  // Format currency values with locale and currency symbol
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground pt-1">Orders placed in period</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground pt-1">Revenue from all orders</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">WIP Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(wipTotal)}</div>
          <p className="text-xs text-muted-foreground pt-1">Work in progress value</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Invoices (Paid/Unpaid)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className="text-green-600">{invoicesPaid}</span>/<span className={invoicesUnpaid > 0 ? "text-amber-500" : ""}>{invoicesUnpaid}</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">Invoice payment status</p>
        </CardContent>
      </Card>
    </div>
  );
};
