
import { supabase } from "@/integrations/supabase/client";

// Update shipment with order ID
export const updateShipmentWithOrder = async (quoteId: string, orderId: string) => {
  console.log("Updating shipment with order ID:", { quoteId, orderId });
  try {
    const { data: shipments, error: fetchError } = await supabase
      .from('shipments')
      .select('id')
      .eq('quote_id', quoteId);
      
    if (fetchError) {
      console.error("Error fetching shipments:", fetchError);
      throw fetchError;
    }
    
    if (shipments && shipments.length > 0) {
      console.log(`Found ${shipments.length} shipments to update with order ID ${orderId}`);
      
      // Update all shipments associated with this quote
      for (const shipment of shipments) {
        const { error: updateError } = await supabase
          .from('shipments')
          .update({ order_id: orderId })
          .eq('id', shipment.id);
          
        if (updateError) {
          console.error(`Error updating shipment ${shipment.id}:`, updateError);
        } else {
          console.log(`Successfully updated shipment ${shipment.id} with order ID ${orderId}`);
        }
      }
    } else {
      console.log("No existing shipments found for quote ID:", quoteId);
    }
  } catch (error) {
    console.error("Error in updateShipmentWithOrder:", error);
  }
};

// Create a new shipment if none exists for this quote
export const createShipmentIfNeeded = async (quoteId: string, orderId: string) => {
  try {
    // Check if any shipment exists for this quote
    const { data: existingShipments, error: checkError } = await supabase
      .from('shipments')
      .select('id')
      .eq('quote_id', quoteId);
      
    if (checkError) {
      console.error("Error checking existing shipments:", checkError);
      return;
    }
    
    // If no shipment exists, create one
    if (!existingShipments || existingShipments.length === 0) {
      console.log("No shipments found for quote, creating a new shipment");
      
      const shipmentPayload = {
        quote_id: quoteId,
        order_id: orderId,
        status: 'pending'
      };
      
      const { data: newShipment, error: createError } = await supabase
        .from('shipments')
        .insert(shipmentPayload)
        .select()
        .single();
        
      if (createError) {
        console.error("Error creating shipment:", createError);
      } else if (newShipment) {
        console.log("Successfully created new shipment:", newShipment);
      }
    }
  } catch (error) {
    console.error("Error in createShipmentIfNeeded:", error);
  }
};
