import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderDetailHeader } from "./order-detail/OrderDetailHeader";
import { OrderDetailContent } from "./order-detail/OrderDetailContent";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useOrderProducts } from "@/hooks/orders/useOrderProducts";
import { useOrderProductsSync } from "@/hooks/orders/useOrderProductsSync";
import { useMaterialBatches } from "@/components/resources/hooks/useMaterialBatches";
import { checkMaterialAvailability, allocateOrderMaterials } from "@/services/materialReservationService";
import { MaterialStatusSection } from "./order-detail/components/MaterialStatusSection";
import { toast } from "@/components/ui/use-toast";

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [checking, setChecking] = useState(false);
  const [allocating, setAllocating] = useState(false);
  
  const { 
    order, 
    loading: orderLoading, 
    refetchOrder,
    updateOrderStatus 
  } = useOrderDetail(id);
  
  const { 
    products, 
    loading: productsLoading, 
    refetchProducts, 
    getProductMaterials 
  } = useOrderProducts(id);

  const { data: batches = [] } = useMaterialBatches();
  
  // Keep products in sync with order changes
  useOrderProductsSync(id, refetchProducts);

  // Map material batches by material ID for faster lookup
  const materialBatchesMap = React.useMemo(() => {
    return batches.reduce((acc, batch) => {
      if (!acc[batch.materialId]) {
        acc[batch.materialId] = [];
      }
      acc[batch.materialId].push(batch);
      return acc;
    }, {});
  }, [batches]);

  const handleCheckMaterials = useCallback(async () => {
    if (!id || products.length === 0) return;
    setChecking(true);

    try {
      const productsWithMaterials = await Promise.all(
        products.map(async (product) => {
          const materials = await getProductMaterials(product.id);
          return { ...product, materials };
        })
      );
      
      const status = await checkMaterialAvailability(
        productsWithMaterials,
        materialBatchesMap
      );

      await updateOrderStatus(id, { parts_status: status });
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
  }, [id, products, getProductMaterials, materialBatchesMap, updateOrderStatus, refetchOrder]);

  const handleAllocateMaterials = useCallback(async () => {
    if (!id || order?.parts_status !== 'booked') return;
    setAllocating(true);

    try {
      const allocated = await allocateOrderMaterials(id);
      
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
  }, [id, order, refetchOrder]);

  useEffect(() => {
    if (!orderLoading && products.length > 0 && !order?.parts_status) {
      handleCheckMaterials();
    }
  }, [orderLoading, products.length, order?.parts_status, handleCheckMaterials]);

  const getStatusBadgeColor = (status) => {
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

  return (
    <MainLayout title="Order Details">
      {order && (
        <>
          <OrderDetailHeader 
            order={order}
            MaterialStatusSection={
              <MaterialStatusSection
                orderPartsStatus={order.parts_status || 'not booked'}
                getStatusBadgeColor={getStatusBadgeColor}
                handleCheckMaterials={handleCheckMaterials}
                handleAllocateMaterials={handleAllocateMaterials}
                checking={checking}
                allocating={allocating}
                productsLoading={productsLoading}
              />
            }
          />
          <OrderDetailContent 
            order={order}
            refetchOrder={refetchOrder}
            products={products}
            refetchProducts={refetchProducts}
          />
        </>
      )}
    </MainLayout>
  );
};

export default OrderDetail;
