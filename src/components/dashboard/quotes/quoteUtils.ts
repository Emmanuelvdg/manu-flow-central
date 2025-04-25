import { supabase } from "@/integrations/supabase/client";

// Safe date formatting function
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(dateString);
  }
};

// Safe currency formatting function
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '$0';
  try {
    return `$${value.toLocaleString()}`;
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `$${String(value)}`;
  }
};

// Quote type definition
export interface Quote {
  id: string;
  rfq_id?: string;
  customer_name: string;
  customer_email?: string;
  company_name?: string;
  created_at: string;
  products: any; // Accept JSON from Supabase
  status: string;
  total: number;
  payment_terms?: string;
  incoterms?: string;
  currency?: string;
  shipping_method?: string;
  estimated_delivery?: string;
  risk_level?: string;
  deposit_percentage?: number;
  quote_number: string;
}

// Fetch quotes from Supabase
export const fetchQuotes = async (): Promise<Quote[]> => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

// Fetch a single quote by ID
export const fetchQuote = async (quoteId: string): Promise<Quote | null> => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  if (error) {
    console.error("Error fetching quote:", error);
    return null;
  }

  return data;
};

// Generate a unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

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

// Create order_products entries for better data normalization
const createOrderProducts = async (orderId: string, products: any[]) => {
  try {
    for (const product of products) {
      // Skip if no product name/id
      if (!product.name && !product.id) continue;
      
      // Find recipe for this product if exists
      let recipeId = null;
      
      if (product.id) {
        const { data: recipes } = await supabase
          .from('recipes')
          .select('id')
          .eq('product_id', product.id)
          .maybeSingle();
          
        if (recipes) {
          recipeId = recipes.id;
        }
      }
      
      const productEntry = {
        order_id: orderId,
        product_id: product.id || product.name,
        quantity: parseInt(product.quantity) || 1,
        unit: product.unit || 'pcs',
        status: 'pending',
        materials_status: 'Not booked',
        recipe_id: recipeId
      };
      
      console.log("Creating order product entry:", productEntry);
      
      const { data, error } = await supabase
        .from('order_products')
        .insert(productEntry)
        .select();
        
      if (error) {
        console.error(`Error creating order product entry:`, error);
      } else {
        console.log("Created order product:", data);
      }
    }
  } catch (error) {
    console.error("Error in createOrderProducts:", error);
  }
};

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
