
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all shipments and associated RFQ, Quote, Order, and Invoice data.
 * @returns {Promise<any[]>} shipment dashboard data
 */
export async function fetchShipmentsWithLinks() {
  console.log("Fetching shipments with links...");
  
  // Get all shipments
  const { data: shipments, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shipments:", error);
    throw new Error(error.message);
  }

  if (!shipments || shipments.length === 0) return [];

  console.log("Fetched shipments:", shipments);

  // Collect all linked document IDs from shipments
  const orderIds = shipments.map((s) => s.order_id).filter(Boolean);
  const quoteIds = shipments.map((s) => s.quote_id).filter(Boolean);
  const rfqIds = shipments.map((s) => s.rfq_id).filter(Boolean);
  const invoiceIds = shipments.map((s) => s.invoice_id).filter(Boolean);

  console.log("Linked IDs:", { orderIds, quoteIds, rfqIds, invoiceIds });

  // Fetch related orders - IMPORTANT: Using the correct ID format
  let orders: any[] = [];
  let quotes: any[] = [];
  let rfqs: any[] = [];
  let invoices: any[] = [];

  // First, fetch quotes since we need them to look up related orders
  if (quoteIds.length > 0) {
    const { data: dbQuotes, error: quoteErr } = await supabase
      .from("quotes")
      .select("*")
      .in("id", quoteIds);

    if (quoteErr) {
      console.error("Error fetching quotes:", quoteErr);
      throw new Error(quoteErr.message);
    }
    quotes = dbQuotes ?? [];
    console.log("Fetched quotes:", quotes);

    // Look for orders that are associated with these quotes
    // This is important because shipments might have quote_id but not order_id yet
    const quoteOrderIds = quotes
      .map(q => q.id)
      .filter(Boolean);

    if (quoteOrderIds.length > 0) {
      const { data: ordersFromQuotes, error: ordersFromQuotesErr } = await supabase
        .from("orders")
        .select("*")
        .in("quote_id", quoteOrderIds);

      if (ordersFromQuotesErr) {
        console.error("Error fetching orders from quotes:", ordersFromQuotesErr);
        throw new Error(ordersFromQuotesErr.message);
      }
      
      if (ordersFromQuotes && ordersFromQuotes.length > 0) {
        console.log("Fetched orders from quotes:", ordersFromQuotes);
        orders = ordersFromQuotes;
      }
    }
  }

  // Then fetch orders directly linked to shipments (if not already fetched)
  if (orderIds.length > 0) {
    const existingOrderIds = orders.map(o => o.id);
    const newOrderIds = orderIds.filter(id => !existingOrderIds.includes(id));
    
    if (newOrderIds.length > 0) {
      const { data: directOrders, error: directOrdersErr } = await supabase
        .from("orders")
        .select("*")
        .in("id", newOrderIds);

      if (directOrdersErr) {
        console.error("Error fetching direct orders:", directOrdersErr);
        throw new Error(directOrdersErr.message);
      }
      
      if (directOrders && directOrders.length > 0) {
        console.log("Fetched direct orders:", directOrders);
        orders = [...orders, ...directOrders];
      }
    }
  }

  console.log("All fetched orders:", orders);

  // Fetch rfqs directly from shipments rfq_ids
  if (rfqIds.length > 0) {
    const { data: dbRFQs, error: rfqErr } = await supabase
      .from("rfqs")
      .select("*")
      .in("id", rfqIds);

    if (rfqErr) {
      console.error("Error fetching RFQs:", rfqErr);
      throw new Error(rfqErr.message);
    }
    rfqs = dbRFQs ?? [];
    console.log("Fetched rfqs:", rfqs);
  }

  // Also fetch RFQs from quotes if they exist
  if (quotes.length > 0) {
    const quoteRfqIds = quotes
      .map((q) => q.rfq_id)
      .filter(Boolean)
      .filter((id) => !rfqIds.includes(id));

    if (quoteRfqIds.length > 0) {
      const { data: dbRFQsFromQuotes, error: rfqsFromQuotesErr } = await supabase
        .from("rfqs")
        .select("*")
        .in("id", quoteRfqIds);

      if (rfqsFromQuotesErr) {
        console.error("Error fetching RFQs from quotes:", rfqsFromQuotesErr);
        throw new Error(rfqsFromQuotesErr.message);
      }
      
      // Add these RFQs to our RFQs collection
      if (dbRFQsFromQuotes) {
        rfqs = [...rfqs, ...dbRFQsFromQuotes];
      }
    }
  }

  // Fetch invoices if there are any
  if (invoiceIds.length > 0) {
    const { data: dbInvoices, error: invoiceErr } = await supabase
      .from("invoices")
      .select("*")
      .in("id", invoiceIds);

    if (invoiceErr) {
      console.error("Error fetching invoices:", invoiceErr);
      throw new Error(invoiceErr.message);
    }
    invoices = dbInvoices ?? [];
  } else if (orderIds.length > 0) {
    // Try to fetch invoices from orders if no direct invoice IDs
    const { data: dbInvoicesFromOrders, error: invoicesFromOrdersErr } = await supabase
      .from("invoices")
      .select("*")
      .in("order_id", orderIds);

    if (invoicesFromOrdersErr) {
      console.error("Error fetching invoices from orders:", invoicesFromOrdersErr);
      throw new Error(invoicesFromOrdersErr.message);
    }
    invoices = dbInvoicesFromOrders ?? [];
  }

  // Build dashboard rows with links, mapping orders to quotes if available
  const dashboardData = shipments.map((shipment) => {
    // Find quote
    const quote = quotes.find((q) => q.id === shipment.quote_id) ?? null;
    
    // Find order - first look for direct link, then through quote
    let order = null;
    if (shipment.order_id) {
      order = orders.find((o) => o.id === shipment.order_id);
    }
    
    // If no direct order link but we have a quote, try to find an order linked to the quote
    if (!order && quote) {
      order = orders.find((o) => o.quote_id === quote.id);
    }
    
    // Find RFQ either directly from shipment or via quote
    const rfq = shipment.rfq_id 
      ? rfqs.find((r) => r.id === shipment.rfq_id) 
      : (quote?.rfq_id ? rfqs.find((r) => r.id === quote.rfq_id) : null);
    
    // Find invoice either directly from shipment or via order
    const invoice = shipment.invoice_id 
      ? invoices.find((i) => i.id === shipment.invoice_id) 
      : (order ? invoices.find((i) => i.order_id === order.id) : null);

    // Update shipment with order info if we found a related order through the quote
    if (!shipment.order_id && order) {
      // This shipment doesn't have a direct order link, but we found one via the quote
      console.log(`Found order ${order.id} for shipment ${shipment.id} through quote ${quote?.id}`);
    }

    return {
      ...shipment,
      order_id: order?.id ?? shipment.order_id ?? null,
      order_number: order?.order_number ?? null,
      quote_id: quote?.id ?? shipment.quote_id ?? null,
      quote_number: quote?.quote_number ?? null,
      rfq_id: rfq?.id ?? shipment.rfq_id ?? null,
      rfq_number: rfq?.rfq_number ?? null,
      invoice_id: invoice?.id ?? shipment.invoice_id ?? null,
      invoice_number: invoice?.invoice_number ?? null,
      eta: shipment.delivery_date,
    };
  });

  console.log("Dashboard data with links:", dashboardData);
  return dashboardData;
}
