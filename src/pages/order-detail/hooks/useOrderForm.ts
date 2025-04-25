
import { useState, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOrderForm = (order: any, orderId: string, refetch: () => Promise<void>) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(order || {});

  const updateMaterialAllocations = async (
    orderId: string,
    status: string,
    materials: any[]
  ) => {
    if (!['booked', 'requested', 'expected'].includes(status)) {
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
      allocation_type: status
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
