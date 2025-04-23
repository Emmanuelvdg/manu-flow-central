
import React from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderDetailHeader } from "./order-detail/OrderDetailHeader";
import { OrderDetailContent } from "./order-detail/OrderDetailContent";
import { useOrderDetail } from "@/hooks/useOrderDetail";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    order,
    orderProducts,
    isLoading,
    productsLoading,
    error,
    refetch
  } = useOrderDetail(id);

  return (
    <MainLayout title={`Order Detail - ${id}`}>
      <div className="max-w-4xl mx-auto mt-8">
        <OrderDetailHeader orderId={id!} />
        <div className="mt-4">
          <OrderDetailContent
            order={order}
            orderId={id!}
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
