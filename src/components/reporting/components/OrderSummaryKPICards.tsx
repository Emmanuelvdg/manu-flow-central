import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { OrderSummarySummary } from "@/types/orderSummary";
import { Package, DollarSign, CreditCard, AlertCircle } from "lucide-react";

interface OrderSummaryKPICardsProps {
  summary: OrderSummarySummary;
}

export const OrderSummaryKPICards: React.FC<OrderSummaryKPICardsProps> = ({
  summary,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.containers['20"']} x 20", {summary.containers['40"']} x 40", {summary.containers['40HC']} x 40HC
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Order Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CurrencyDisplay amount={summary.totalOrderValue} currency="USD" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Combined value of all orders</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CurrencyDisplay amount={summary.totalPaid} currency="USD" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {((summary.totalPaid / summary.totalOrderValue) * 100 || 0).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CurrencyDisplay amount={summary.outstandingAmount} currency="USD" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Remaining payments due</p>
        </CardContent>
      </Card>
    </div>
  );
};
