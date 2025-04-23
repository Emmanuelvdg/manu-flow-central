
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OrderMetaForm } from "./OrderMetaForm";
import { OrderProductsProgress } from "./OrderProductsProgress";
import { OrderDetailState } from "./components/OrderDetailState";
import { useOrderForm } from "./hooks/useOrderForm";

interface OrderDetailContentProps {
  order: any;
  orderId: string;
  isLoading: boolean;
  error: Error | null;
  productsLoading: boolean;
  orderProducts: any[];
  refetch: () => void;
}

export const OrderDetailContent: React.FC<OrderDetailContentProps> = ({
  order,
  orderId,
  isLoading,
  error,
  productsLoading,
  orderProducts,
  refetch
}) => {
  const { formData, handleChange, handleSaveOrder } = useOrderForm(order, orderId, refetch);

  if (isLoading || error || !order) {
    return <OrderDetailState isLoading={isLoading} error={error} />;
  }

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
        <OrderProductsProgress 
          productsLoading={productsLoading}
          orderProducts={orderProducts}
        />
      </CardContent>
    </Card>
  );
};
