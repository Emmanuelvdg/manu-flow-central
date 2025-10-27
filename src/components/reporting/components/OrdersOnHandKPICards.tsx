import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersOnHandSummary } from "@/types/ordersOnHand";
import { Package, ShoppingCart, CheckCircle2, AlertTriangle } from "lucide-react";

interface OrdersOnHandKPICardsProps {
  summary: OrdersOnHandSummary;
}

export const OrdersOnHandKPICards: React.FC<OrdersOnHandKPICardsProps> = ({ summary }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">On Hand Value</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalOnHandValue)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">On Order Value</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalOnOrderValue)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Value</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalAvailableValue)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">At Risk Items</p>
              <p className="text-2xl font-bold">{summary.stockoutRiskCount.high + summary.stockoutRiskCount.medium}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.stockoutRiskCount.high} High, {summary.stockoutRiskCount.medium} Medium
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
