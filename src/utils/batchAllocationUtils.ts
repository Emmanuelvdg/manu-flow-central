
import { supabase } from "@/integrations/supabase/client";
import { allocateOrderMaterials } from "@/services/materialReservationService";

/**
 * Processes all orders that have "booked" material status and allocates
 * materials from inventory for them based on FIFO
 */
export const allocateAllBookedOrders = async (): Promise<{
  success: number;
  failed: number;
  total: number;
}> => {
  try {
    // Fetch all orders with "booked" parts_status
    const { data: bookedOrders, error } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('parts_status', 'booked');
    
    if (error) {
      console.error("Error fetching booked orders:", error);
      throw error;
    }
    
    console.log(`Found ${bookedOrders.length} orders with booked status`);
    
    // Process each order
    const results = {
      success: 0,
      failed: 0,
      total: bookedOrders.length
    };
    
    for (const order of bookedOrders) {
      console.log(`Processing order: ${order.order_number} (${order.id})`);
      try {
        // Allocate materials for the order
        const success = await allocateOrderMaterials(order.id);
        
        if (success) {
          console.log(`Successfully allocated materials for order: ${order.order_number}`);
          results.success++;
        } else {
          console.error(`Failed to allocate materials for order: ${order.order_number}`);
          results.failed++;
        }
      } catch (error) {
        console.error(`Error allocating materials for order ${order.order_number}:`, error);
        results.failed++;
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error in batch allocation process:", error);
    throw error;
  }
};

/**
 * Checks if orders have already been allocated materials
 * to avoid duplicate allocations
 */
export const checkAllocationStatus = async (): Promise<{
  allocated: number;
  unallocated: number;
  total: number;
}> => {
  try {
    // Get all booked orders
    const { data: bookedOrders, error } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('parts_status', 'booked');
    
    if (error) throw error;
    
    const results = {
      allocated: 0,
      unallocated: 0,
      total: bookedOrders.length
    };
    
    // Check allocations for each
    for (const order of bookedOrders) {
      const { data: allocations } = await supabase
        .from('material_allocations')
        .select('id')
        .eq('order_id', order.id)
        .limit(1);
      
      if (allocations && allocations.length > 0) {
        results.allocated++;
      } else {
        results.unallocated++;
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error checking allocation status:", error);
    throw error;
  }
};
