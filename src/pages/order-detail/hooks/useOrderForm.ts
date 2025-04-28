
import { useState, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOrderForm = (order: any, orderId: string, refetch: () => Promise<void>) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(() => {
    // Initialize form data based on order or quote information if available
    if (order) {
      // Get customer name from order or from quote if not in order
      const customerName = order.customer_name || 
        (order.quotes && order.quotes.customer_name ? order.quotes.customer_name : '');
      
      // Handle shipping address with better fallbacks
      let shippingAddress = order.shipping_address || '';
      
      // If shipping address is empty or generic, try to build a better one from quote data
      if ((!shippingAddress || shippingAddress === 'null') && order.quotes) {
        // Build shipping address from quote information
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
      
      return {
        customerName: customerName || '',
        status: order.status || 'created',
        shippingAddress: shippingAddress || '',
      };
    }
    
    // Return default values even when there's no order
    return {
      customerName: '',
      status: 'created',
      shippingAddress: '',
    };
  });

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
