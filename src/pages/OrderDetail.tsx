
import React from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderDetailHeader } from "./order-detail/OrderDetailHeader";
import { OrderDetailContent } from "./order-detail/OrderDetailContent";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useMaterialBatches } from "@/components/resources/hooks/useMaterialBatches";
import { useMaterials } from "@/components/resources/hooks/useMaterials";
import { updateOrderMaterialsStatus } from "@/utils/materialUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id || "";
  const { toast } = useToast();
  
  // Special case for quote-order mapping view
  const isQuoteOrderMapping = orderId === "quote-order-mapping";
  
  const { 
    order,
    orderProducts,
    isLoading,
    productsLoading,
    error,
    refetch,
    syncOrderProducts,
    fixOrderProductMapping
  } = useOrderDetail(isQuoteOrderMapping ? undefined : orderId);

  // Fetch materials and their batches
  const { data: batches } = useMaterialBatches();
  const { materials } = useMaterials();

  React.useEffect(() => {
    if (!orderProducts || !batches || orderProducts.length === 0 || !order) return;

    // Group batches by material ID
    const materialBatches = batches.reduce((acc: any, batch) => {
      if (!acc[batch.materialId]) {
        acc[batch.materialId] = [];
      }
      acc[batch.materialId].push(batch);
      return acc;
    }, {});

    // Calculate and update order status
    const updateStatus = async () => {
      const newStatus = await updateOrderMaterialsStatus(orderProducts, materialBatches);
      
      if (order?.parts_status !== newStatus) {
        try {
          // Use the actual UUID of the order, not the order_number
          const { error } = await supabase
            .from('orders')
            .update({ parts_status: newStatus })
            .eq('id', order.id);

          if (error) throw error;

          refetch();
          
          toast({
            title: "Status Updated",
            description: `Order parts status updated to ${newStatus}`,
          });
        } catch (err) {
          console.error("Error updating order status:", err);
          toast({
            title: "Update Failed",
            description: "Failed to update order status",
            variant: "destructive",
          });
        }
      }
    };

    updateStatus();
  }, [orderProducts, batches, order?.parts_status]);

  // Run debug mapping on initial load
  React.useEffect(() => {
    if (order && !isQuoteOrderMapping) {
      console.log(`Initial recipe mapping check for order ${orderId}`);
    }
  }, [order, orderId, isQuoteOrderMapping]);

  return (
    <MainLayout title={isQuoteOrderMapping ? "Quote-Order Mappings" : `Order Detail - ${orderId}`}>
      <div className="max-w-4xl mx-auto mt-8">
        <OrderDetailHeader orderId={orderId} />
        <div className="mt-4">
          <OrderDetailContent
            order={order}
            orderId={orderId}
            isLoading={isLoading}
            error={error}
            productsLoading={productsLoading}
            orderProducts={orderProducts}
            refetch={async () => {
              // Wrap the refetch call in an async function
              await Promise.resolve(refetch());
            }}
            syncOrderProducts={syncOrderProducts}
            fixOrderProductMapping={fixOrderProductMapping}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetail;
