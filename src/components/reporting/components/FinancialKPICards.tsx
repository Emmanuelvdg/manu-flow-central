
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { FinancialData } from "../hooks/useFinancialData";

interface FinancialKPICardsProps {
  data: FinancialData;
}

export const FinancialKPICards: React.FC<FinancialKPICardsProps> = ({ data }) => {
  const { totalOrders, totalRevenue, wipTotal, invoicesPaid, invoicesUnpaid } = data;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">WIP Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${wipTotal.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Invoices (Paid/Unpaid)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoicesPaid}/{invoicesUnpaid}</div>
        </CardContent>
      </Card>
    </div>
  );
};
