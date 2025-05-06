
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderDetailHeader } from "./order-detail/OrderDetailHeader";
import { OrderDetailContent } from "./order-detail/OrderDetailContent";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useMaterialBatches } from "@/components/resources/hooks/useMaterialBatches";
import { checkMaterialAvailability } from "@/services/materialReservationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id || "";
  const { toast } = useToast();
  
  // Special case for quote-order mapping view
  const isQuoteOrderMapping = orderId === "quote-order-mapping";
  
  // Track whether initial status check has run
  const statusCheckCompleted = useRef(false);
  
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

  // Run material availability check only once when data is available
  useEffect(() => {
    if (statusCheckCompleted.current || !orderProducts || !batches || orderProducts.length === 0 || !order) return;

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
      try {
        const newStatus = await checkMaterialAvailability(orderProducts, materialBatches);
        
        if (order?.parts_status !== newStatus) {
          // Use the actual UUID of the order, not the order_number
          const { error } = await supabase
            .from('orders')
            .update({ parts_status: newStatus })
            .eq('id', order.id);

          if (error) throw error;

          refetch();
          
          console.log(`Status updated from ${order?.parts_status} to ${newStatus}`);
        }
        
        // Mark status check as completed to prevent repeated runs
        statusCheckCompleted.current = true;
      } catch (err) {
        console.error("Error updating order status:", err);
      }
    };

    updateStatus();
  }, [orderProducts, batches, order?.id, order?.parts_status, refetch]);

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
