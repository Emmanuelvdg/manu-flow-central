
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OrderMetaForm } from "./OrderMetaForm";
import { OrderProductsProgress } from "./OrderProductsProgress";
import { OrderRoutingStages } from "./components/OrderRoutingStages";
import { OrderDetailState } from "./components/OrderDetailState";
import { useOrderForm } from "./hooks/useOrderForm";
import { Button } from "@/components/ui/button";
import { CircleAlert, Wrench } from "lucide-react";

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

  const showMappings = orderId === "quote-order-mapping";

  if (isLoading || error || !order || showMappings) {
    return <OrderDetailState isLoading={isLoading} error={error} showMappings={showMappings} />;
  }

  const hasNoProducts = !productsLoading && orderProducts.length === 0;
  const hasProductsWithNoRecipes = orderProducts.some(product => !product.recipe_id);

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

  // Normalize parts_status for consistent display
  const normalizedPartsStatus = order.parts_status ? order.parts_status.toLowerCase() : 'not booked';

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

          {hasProductsWithNoRecipes && fixOrderProductMapping && (
            <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CircleAlert className="h-5 w-4 text-blue-500" />
                <span>Some products are missing recipe mappings. Fix recipe mappings to enable production tracking.</span>
              </div>
              <Button 
                onClick={handleFixMappings} 
                variant="outline" 
                className="bg-blue-100 hover:bg-blue-200"
                disabled={fixing}
              >
                <Wrench className="h-4 w-4 mr-2" />
                {fixing ? "Fixing Mappings..." : "Fix Recipe Mappings"}
              </Button>
            </div>
          )}

          {!hasNoProducts && !hasProductsWithNoRecipes && fixOrderProductMapping && (
            <div className="w-full flex justify-end">
              <Button 
                onClick={handleFixMappings} 
                variant="outline" 
                className="bg-slate-50 hover:bg-slate-100"
                disabled={fixing}
                size="sm"
              >
                <Wrench className="h-4 w-4 mr-2" />
                {fixing ? "Checking Mappings..." : "Verify Recipe Mappings"}
              </Button>
            </div>
          )}
        </div>
        
        <OrderProductsProgress 
          productsLoading={productsLoading}
          orderProducts={orderProducts.map(p => ({
            ...p,
            materials_status: normalizedPartsStatus // Ensure consistent status display
          }))}
          orderId={orderId}
        />
        
        {/* Add the OrderRoutingStages component */}
        {!hasNoProducts && (
          <OrderRoutingStages 
            orderId={orderId} 
            orderProducts={orderProducts} 
            refetch={refetch}
          />
        )}
      </CardContent>
    </Card>
  );
};
