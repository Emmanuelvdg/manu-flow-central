
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrderFormData {
  customerName: string;
  status: string;
  shippingAddress: string;
}

export const useOrderForm = (order: any, orderId: string, refetch: () => void) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<OrderFormData>({
    customerName: "",
    status: "Processing",
    shippingAddress: "",
  });

  React.useEffect(() => {
    if (order) {
      console.log("Setting form data from order:", order);
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

  return {
    formData,
    handleChange,
    handleSaveOrder
  };
};
