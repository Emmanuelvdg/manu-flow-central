
import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderDetailHeader } from "./order-detail/OrderDetailHeader";
import { OrderDetailContent } from "./order-detail/OrderDetailContent";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useMaterialBatches } from "@/components/resources/hooks/useMaterialBatches";
import { checkMaterialAvailability, allocateOrderMaterials } from "@/services/materialReservationService";
import { MaterialStatusSection } from "./order-detail/components/MaterialStatusSection";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [checking, setChecking] = useState(false);
  const [allocating, setAllocating] = useState(false);
  
  const { 
    order, 
    isLoading: orderLoading, 
    error: orderError,
    refetch: refetchOrder,
    syncOrderProducts,
    fixOrderProductMapping,
    orderProducts
  } = useOrderDetail(id);
  
  const { data: batches = [] } = useMaterialBatches();
  
  // Map material batches by material ID for faster lookup
  const materialBatchesMap = React.useMemo(() => {
    return batches.reduce((acc: any, batch) => {
      if (!acc[batch.materialId]) {
        acc[batch.materialId] = [];
      }
      acc[batch.materialId].push(batch);
      return acc;
    }, {});
  }, [batches]);

  const getProductMaterials = async (productId: string) => {
    try {
      const { data } = await supabase
        .from('order_materials')
        .select('*')
        .eq('order_product_id', productId);
      return data || [];
    } catch (error) {
      console.error("Error fetching product materials:", error);
      return [];
    }
  };

  const updateOrderStatus = async (orderId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  const handleCheckMaterials = useCallback(async () => {
    if (!order?.id || orderProducts.length === 0) return;
    setChecking(true);

    try {
      const productsWithMaterials = await Promise.all(
        orderProducts.map(async (product) => {
          const materials = await getProductMaterials(product.id);
          return { ...product, materials };
        })
      );
      
      const status = await checkMaterialAvailability(
        productsWithMaterials,
        materialBatchesMap
      );

      await updateOrderStatus(order.id, { parts_status: status });
      await refetchOrder();
      
      toast({
        title: "Materials Status Updated",
        description: `Material availability status: ${status}`
      });
    } catch (error) {
      console.error("Error checking materials:", error);
      toast({
        title: "Error",
        description: "Failed to check material availability",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  }, [order?.id, orderProducts, materialBatchesMap, refetchOrder]);

  const handleAllocateMaterials = useCallback(async () => {
    if (!order?.id || order?.parts_status !== 'booked') return;
    setAllocating(true);

    try {
      const allocated = await allocateOrderMaterials(order.id);
      
      if (allocated) {
        await refetchOrder();
        toast({
          title: "Materials Allocated",
          description: "Materials have been successfully allocated from inventory"
        });
      } else {
        toast({
          title: "Allocation Failed",
          description: "Failed to allocate materials from inventory",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error allocating materials:", error);
      toast({
        title: "Error",
        description: "An error occurred while allocating materials",
        variant: "destructive"
      });
    } finally {
      setAllocating(false);
    }
  }, [order, refetchOrder]);

  React.useEffect(() => {
    if (!orderLoading && orderProducts.length > 0 && !order?.parts_status) {
      handleCheckMaterials();
    }
  }, [orderLoading, orderProducts.length, order?.parts_status, handleCheckMaterials]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expected':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'requested':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'not enough':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'delayed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRefetch = async () => {
    await refetchOrder();
  };

  return (
    <MainLayout title="Work Order Details">
      {order && (
        <>
          <OrderDetailHeader 
            orderId={order.id}
            orderDate={order.order_date}
            customerName={order.customer_name}
            status={order.status}
            MaterialStatusSection={
              <MaterialStatusSection
                orderPartsStatus={order.parts_status || 'not booked'}
                getStatusBadgeColor={getStatusBadgeColor}
                handleCheckMaterials={handleCheckMaterials}
                handleAllocateMaterials={handleAllocateMaterials}
                checking={checking}
                allocating={allocating}
                productsLoading={false}
              />
            }
          />
          <OrderDetailContent 
            orderId={order.id}
            order={order}
            isLoading={orderLoading}
            error={orderError}
            productsLoading={false}
            orderProducts={orderProducts}
            refetch={handleRefetch}
            syncOrderProducts={async () => {
              if (syncOrderProducts) {
                await syncOrderProducts();
              }
            }}
            fixOrderProductMapping={async () => {
              if (fixOrderProductMapping) {
                await fixOrderProductMapping();
              }
            }}
          />
        </>
      )}
    </MainLayout>
  );
};

export default OrderDetail;
