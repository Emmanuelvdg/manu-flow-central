import React, { useState } from "react";
import { useOrderSummaryData } from "./hooks/useOrderSummaryData";
import { OrderSummaryKPICards } from "./components/OrderSummaryKPICards";
import { OrderSummaryTable } from "./components/OrderSummaryTable";
import { OrderLogistics } from "@/types/orderSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfMonth, subMonths } from "date-fns";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const OrderSummaryReport: React.FC = () => {
  const [startMonth, setStartMonth] = useState<Date>(
    startOfMonth(subMonths(new Date(), 2))
  );
  const [endMonth, setEndMonth] = useState<Date>(startOfMonth(new Date()));

  const { data, isLoading, error, refetch, updateLogistics } = useOrderSummaryData({
    startMonth,
    endMonth,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
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
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Start Month:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !startMonth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startMonth ? format(startMonth, "MMMM yyyy") : "Pick a month"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startMonth}
                onSelect={(date) => date && setStartMonth(startOfMonth(date))}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">End Month:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !endMonth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endMonth ? format(endMonth, "MMMM yyyy") : "Pick a month"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endMonth}
                onSelect={(date) => date && setEndMonth(startOfMonth(date))}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <OrderSummaryKPICards summary={data.summary} />

      <OrderSummaryTable 
        data={data.rows} 
        onUpdate={(orderId, field, value) => 
          updateLogistics({ orderId, field: field as keyof OrderLogistics, value })
        } 
      />
    </div>
  );
};
