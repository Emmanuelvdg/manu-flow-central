
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "../types/quoteTypes";
import { generateOrderNumber } from "./utils/orderNumberUtils";
import { createOrderProducts } from "./products/orderProductService";
import { updateShipmentWithOrder, createShipmentIfNeeded } from "./shipments/shipmentService";

// Enhanced function to create an order from a quote
export const createOrderFromQuote = async (quote: Partial<Quote> & { id: string; customer_name: string; products: any; total: number; }) => {
  console.log("Creating order from quote:", quote);
  
  if (!quote || !quote.id || !quote.customer_name) {
    console.error("Invalid quote data for order creation");
    throw new Error("Invalid quote data for order creation");
  }
  
  // Ensure created_at exists (add current timestamp if missing)
  const quoteWithDefaults = {
    ...quote,
    created_at: quote.created_at || new Date().toISOString()
  };
  
  try {
    // Check if an order already exists for this quote to prevent duplicates
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('quote_id', quote.id)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking for existing order:", checkError);
      // Continue with order creation despite check error
    }
    
    // If order already exists, return it
    if (existingOrder) {
      console.log("Order already exists for this quote:", existingOrder);
      return existingOrder;
    }
    
    // Create new order number
    const orderNumber = generateOrderNumber();
    
    // Prepare order payload with normalized product data and quote information
    const orderPayload = {
      quote_id: quote.id,
      order_number: orderNumber,
      customer_name: quote.customer_name,
      products: quote.products,
      total: quote.total,
      status: 'created',
      parts_status: 'Not booked',
      // Include shipping method and incoterms as shipping address
      shipping_address: quote.shipping_method ? 
        `${quote.shipping_method}${quote.incoterms ? ` - ${quote.incoterms}` : ''}` : 
        null
    };

    // Step 1: Create the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }
    
    if (!orderData) {
      console.error("No order data returned after insertion");
      throw new Error("Order creation failed - no data returned");
    }
    
    console.log("Order created successfully:", orderData);
    
    // Step 2: Update any existing shipment for this quote with the new order ID
    await updateShipmentWithOrder(quote.id, orderData.id);
    
    // Step 3: Check if we need to create a new shipment for this order
    await createShipmentIfNeeded(quote.id, orderData.id);
    
    // Step 4: Create order_products entries to better represent the products
    if (quote.products && Array.isArray(quote.products) && quote.products.length > 0) {
      await createOrderProducts(orderData.id, quote.products);
    }
    
    return orderData;
  } catch (error) {
    console.error("Error in createOrderFromQuote:", error);
    throw error;
  }
};
