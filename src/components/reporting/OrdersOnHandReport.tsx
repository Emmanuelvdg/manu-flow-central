import React from "react";
import { useOrdersOnHandData } from "./hooks/useOrdersOnHandData";
import { OrdersOnHandKPICards } from "./components/OrdersOnHandKPICards";
import { InventoryCompositionChart } from "./components/InventoryCompositionChart";
import { StockRiskChart } from "./components/StockRiskChart";
import { OrdersOnHandTable } from "./components/OrdersOnHandTable";
import { Skeleton } from "@/components/ui/skeleton";

interface OrdersOnHandReportProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

export const OrdersOnHandReport: React.FC<OrdersOnHandReportProps> = ({ dateRange }) => {
  const { data, isLoading, error } = useOrdersOnHandData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading report: {(error as Error).message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrdersOnHandKPICards summary={data.summary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryCompositionChart data={data.rows} />
        <StockRiskChart summary={data.summary} />
      </div>

      <OrdersOnHandTable data={data.rows} />
    </div>
  );
};
