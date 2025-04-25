
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OrderMetaForm } from "./OrderMetaForm";
import { OrderProductsProgress } from "./OrderProductsProgress";
import { OrderDetailState } from "./components/OrderDetailState";
import { useOrderForm } from "./hooks/useOrderForm";
import { Button } from "@/components/ui/button";
import { CircleAlert, Tool } from "lucide-react";

interface OrderDetailContentProps {
  order: any;
  orderId: string;
  isLoading: boolean;
  error: Error | null;
  productsLoading: boolean;
  orderProducts: any[];
  refetch: () => Promise<void>;
  syncOrderProducts?: () => Promise<void>;
  fixOrderProductMapping?: () => Promise<void>;
}

export const OrderDetailContent: React.FC<OrderDetailContentProps> = ({
  order,
  orderId,
  isLoading,
  error,
  productsLoading,
  orderProducts,
  refetch,
  syncOrderProducts,
  fixOrderProductMapping
}) => {
  const { formData, handleChange, handleSaveOrder } = useOrderForm(order, orderId, refetch);
  const [syncing, setSyncing] = React.useState(false);
  const [fixing, setFixing] = React.useState(false);

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

  const handleFixMappings = async () => {
    if (!fixOrderProductMapping) return;
    
    try {
      setFixing(true);
      await fixOrderProductMapping();
    } finally {
      setFixing(false);
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
        
        <div className="flex flex-wrap gap-2 mt-4 mb-4">
          {hasNoProducts && syncOrderProducts && (
            <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-between">
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

          {!hasNoProducts && fixOrderProductMapping && (
            <div className="w-full flex justify-end">
              <Button 
                onClick={handleFixMappings} 
                variant="outline" 
                className="bg-blue-50 hover:bg-blue-100"
                disabled={fixing}
                size="sm"
              >
                <Tool className="h-4 w-4 mr-2" />
                {fixing ? "Fixing Mappings..." : "Fix Recipe Mappings"}
              </Button>
            </div>
          )}
        </div>
        
        <OrderProductsProgress 
          productsLoading={productsLoading}
          orderProducts={orderProducts}
        />
      </CardContent>
    </Card>
  );
};
