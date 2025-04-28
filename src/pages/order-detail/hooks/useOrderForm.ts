
import { useState, ChangeEvent, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOrderForm = (order: any, orderId: string, refetch: () => Promise<void>) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    status: 'created',
    shippingAddress: '',
  });

  // Initialize form data when order changes
  useEffect(() => {
    if (order) {
      console.log("Setting form data from order:", order);
      
      // Get customer name with fallback to quote data
      const customerName = order.customer_name || 
        (order.quotes && order.quotes.customer_name ? order.quotes.customer_name : '');
      
      // Handle shipping address with better fallbacks
      let shippingAddress = order.shipping_address || '';
      
      // If shipping address is empty or non-meaningful, build from quote data
      if ((!shippingAddress || shippingAddress === 'null') && order.quotes) {
        const addressParts = [];
        
        // Add company name if available
        if (order.quotes.company_name) {
          addressParts.push(order.quotes.company_name);
        }
        
        // Add shipping method and incoterms if available
        if (order.quotes.shipping_method || order.quotes.incoterms) {
          const shippingInfo = [
            order.quotes.shipping_method,
            order.quotes.incoterms
          ].filter(Boolean).join(', ');
          
          if (shippingInfo) {
            addressParts.push(shippingInfo);
          }
        }
        
        // Add location if available
        if (order.quotes.location) {
          addressParts.push(order.quotes.location);
        }
        
        // Combine all available address parts
        if (addressParts.length > 0) {
          shippingAddress = addressParts.join(' - ');
        }
      }
      
      setFormData({
        customerName: customerName || '',
        status: order.status || 'created',
        shippingAddress: shippingAddress || '',
      });
    }
  }, [order]);

  const updateMaterialAllocations = async (
    orderId: string,
    status: string,
    materials: any[]
  ) => {
    if (!['booked', 'requested', 'expected'].includes(status.toLowerCase())) {
      // Delete existing allocations if status is not one of these
      await supabase
        .from('material_allocations')
        .delete()
        .eq('order_id', orderId);
      return;
    }

    // Create or update allocations
    const allocations = materials.map(material => ({
      order_id: orderId,
      material_id: material.materialId,
      quantity: material.quantity,
      allocation_type: status.toLowerCase()
    }));

    await supabase
      .from('material_allocations')
      .upsert(allocations, { onConflict: 'order_id,material_id' });
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveOrder = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(formData)
        .eq('id', orderId);

      if (error) throw error;

      // Update material allocations based on order status
      if (order?.products) {
        const materials = order.products.flatMap((product: any) => 
          product.materials || []
        );
        await updateMaterialAllocations(orderId, formData.status, materials);
      }

      await refetch();
      
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order",
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
