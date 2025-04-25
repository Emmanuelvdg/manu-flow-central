
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OrderMetaForm } from "./OrderMetaForm";
import { OrderProductsProgress } from "./OrderProductsProgress";
import { OrderDetailState } from "./components/OrderDetailState";
import { useOrderForm } from "./hooks/useOrderForm";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";

interface OrderDetailContentProps {
  order: any;
  orderId: string;
  isLoading: boolean;
  error: Error | null;
  productsLoading: boolean;
  orderProducts: any[];
  refetch: () => Promise<void>;
  syncOrderProducts?: () => Promise<void>;
}

export const OrderDetailContent: React.FC<OrderDetailContentProps> = ({
  order,
  orderId,
  isLoading,
  error,
  productsLoading,
  orderProducts,
  refetch,
  syncOrderProducts
}) => {
  const { formData, handleChange, handleSaveOrder } = useOrderForm(order, orderId, refetch);
  const [syncing, setSyncing] = React.useState(false);

  // If we're on the root orders page with no specific order ID, show mappings
  const showMappings = orderId === "quote-order-mapping";

  if (isLoading || error || !order || showMappings) {
    return <OrderDetailState isLoading={isLoading} error={error} showMappings={showMappings} />;
  }

  const hasNoProducts = !productsLoading && orderProducts.length === 0;

  const handleSyncProducts = async () => {
    if (!syncOrderProducts) return;
    
    try {
      setSyncing(true);
      await syncOrderProducts();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order #{order.order_number || orderId}</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderMetaForm 
          formData={formData}
          isLoading={isLoading}
          onChange={handleChange}
          onSave={handleSaveOrder}
        />
        
        {hasNoProducts && syncOrderProducts && (
          <div className="mt-4 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleAlert className="h-5 w-4 text-amber-500" />
              <span>No product entries found for this order. Sync to create them from order data.</span>
            </div>
            <Button 
              onClick={handleSyncProducts} 
              variant="outline" 
              className="bg-amber-100 hover:bg-amber-200"
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync Products"}
            </Button>
          </div>
        )}
        
        <OrderProductsProgress 
          productsLoading={productsLoading}
          orderProducts={orderProducts}
        />
      </CardContent>
    </Card>
  );
};
