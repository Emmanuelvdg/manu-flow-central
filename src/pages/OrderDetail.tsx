
import React from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderDetailHeader } from "./order-detail/OrderDetailHeader";
import { OrderDetailContent } from "./order-detail/OrderDetailContent";
import { useOrderDetail } from "@/hooks/useOrderDetail";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id || "";
  
  // Special case for quote-order mapping view
  const isQuoteOrderMapping = orderId === "quote-order-mapping";
  
  const { 
    order,
    orderProducts,
    isLoading,
    productsLoading,
    error,
    refetch
  } = useOrderDetail(isQuoteOrderMapping ? undefined : orderId);

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
            refetch={refetch}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetail;
