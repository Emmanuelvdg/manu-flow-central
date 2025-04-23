
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OrderMetaForm } from "./OrderMetaForm";
import { OrderProductsProgress } from "./OrderProductsProgress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    customerName: "",
    status: "Processing",
    shippingAddress: "",
  });

  React.useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customer_name || "",
        status: order.status || "Processing",
        shippingAddress: order.shipping_address || "",
      });
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveOrder = async () => {
    if (!order) return;
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          customer_name: formData.customerName,
          status: formData.status,
          shipping_address: formData.shippingAddress,
        })
        .eq('id', order.id);
      if (error) throw error;
      
      toast({
        title: "Order updated",
        description: `Order #${orderId} has been successfully updated.`,
      });
      
      refetch();
    } catch (err) {
      console.error("Error updating order:", err);
      toast({
        title: "Update failed",
        description: "Could not update the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="py-4 text-center">Loading order details...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-red-500 py-4 text-center">
            Error loading order: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent>
          <div className="text-red-500 py-4 text-center">Order not found</div>
        </CardContent>
      </Card>
    );
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
