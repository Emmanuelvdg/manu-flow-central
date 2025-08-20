import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState } from "@/pages/quote-detail/components/LoadingState";
import { ErrorState } from "@/pages/quote-detail/components/ErrorState";
import { BurndownChart } from "./components/BurndownChart";
import { CumulativeFlowChart } from "./components/CumulativeFlowChart";
import { useOrderProcessingData, useOrdersList } from "./hooks/useOrderProcessingData";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderProcessingReportProps {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
}

export const OrderProcessingReport: React.FC<OrderProcessingReportProps> = ({ dateRange }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const isMobile = useIsMobile();
  
  const { data: orders = [], isLoading: ordersLoading } = useOrdersList();
  const { data: orderData, isLoading: orderDataLoading, error } = useOrderProcessingData(selectedOrderId);

  const isLoading = ordersLoading || orderDataLoading;

  if (isLoading && !orderData) {
    return <LoadingState message="Loading order processing data..." />;
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return (
      <ErrorState 
        message="Unable to load order processing data" 
        error={errorMessage}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 sm:px-0">
        <h2 className="text-xl font-bold">Order Processing Reports</h2>
        
        {/* Order Selection */}
        <div className="w-full sm:w-80">
          <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an order to analyze" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.order_number} - {order.customer_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedOrderId ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">Select an Order</h3>
              <p>Choose an order from the dropdown above to view detailed processing reports</p>
            </div>
          </CardContent>
        </Card>
      ) : !orderData ? (
        <LoadingState message="Loading order details..." />
      ) : (
        <>
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Order Number</div>
                  <div className="font-medium">{orderData.orderNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Customer</div>
                  <div className="font-medium">{orderData.customerName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                  <div className="font-medium">{orderData.totalItems}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Products</div>
                  <div className="font-medium">{orderData.products.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className={`grid gap-4 sm:gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-1'} w-full`}>
            <BurndownChart data={orderData} />
            <CumulativeFlowChart data={orderData} />
          </div>

          {/* Detailed Stage Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Stage Progress Details</CardTitle>
            </CardHeader>
            <CardContent>
              {!orderData.products.length ? (
                <div className="text-center text-muted-foreground py-8">
                  No products found for this order
                </div>
              ) : orderData.products.every(p => !p.stageProgress.length) ? (
                <div className="text-center text-muted-foreground py-8">
                  No stage progress data available for any products in this order
                </div>
              ) : (
                <div className="space-y-4">
                  {orderData.products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">
                        {product.productName} (Qty: {product.quantity})
                      </h4>
                      {!product.stageProgress.length ? (
                        <div className="text-muted-foreground text-sm py-2">
                          No stage progress data for this product
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          {product.stageProgress.map((stage) => (
                            <div key={stage.stageId} className="bg-muted/50 rounded p-3">
                              <div className="font-medium text-primary">{stage.stageName}</div>
                              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                                <div>
                                  <span className="text-gray-500">Not Started:</span>
                                  <div className="font-medium">{stage.yetToStartUnits}</div>
                                </div>
                                <div>
                                  <span className="text-orange-500">In Progress:</span>
                                  <div className="font-medium text-orange-600">{stage.inProgressUnits}</div>
                                </div>
                                <div>
                                  <span className="text-green-500">Completed:</span>
                                  <div className="font-medium text-green-600">{stage.completedUnits}</div>
                                </div>
                              </div>
                              <div className="mt-2 text-xs">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ 
                                      width: `${stage.totalUnits > 0 ? (stage.completedUnits / stage.totalUnits) * 100 : 0}%` 
                                    }}
                                  />
                                </div>
                                <div className="text-center mt-1">
                                  {stage.totalUnits > 0 ? Math.round((stage.completedUnits / stage.totalUnits) * 100) : 0}% Complete
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};