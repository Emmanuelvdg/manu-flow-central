
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

  // Fetch orders if there are any
  if (orderIds.length > 0) {
    const { data: dbOrders, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .in("id", orderIds);

    if (orderErr) {
      console.error("Error fetching orders:", orderErr);
      throw new Error(orderErr.message);
    }
    orders = dbOrders ?? [];
    console.log("Fetched orders for shipments:", orders);
  }

  // Fetch quotes directly from shipments quote_ids
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
  }

  // Also fetch quotes from orders if they exist
  if (orders.length > 0) {
    const orderQuoteIds = orders
      .map((o) => o.quote_id)
      .filter(Boolean)
      .filter((id) => !quoteIds.includes(id));

    if (orderQuoteIds.length > 0) {
      const { data: dbQuotesFromOrders, error: quotesFromOrdersErr } = await supabase
        .from("quotes")
        .select("*")
        .in("id", orderQuoteIds);

      if (quotesFromOrdersErr) {
        console.error("Error fetching quotes from orders:", quotesFromOrdersErr);
        throw new Error(quotesFromOrdersErr.message);
      }
      
      // Add these quotes to our quotes collection
      if (dbQuotesFromOrders) {
        quotes = [...quotes, ...dbQuotesFromOrders];
      }
    }
  }

  // Fetch RFQs directly from shipments rfq_ids
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

  // Build dashboard rows with links
  const dashboardData = shipments.map((shipment) => {
    // Find related documents
    const order = orders.find((o) => o.id === shipment.order_id) ?? null;
    
    // Find quote either directly from shipment or via order
    const quote = shipment.quote_id 
      ? quotes.find((q) => q.id === shipment.quote_id) 
      : (order?.quote_id ? quotes.find((q) => q.id === order.quote_id) : null);
    
    // Find RFQ either directly from shipment or via quote
    const rfq = shipment.rfq_id 
      ? rfqs.find((r) => r.id === shipment.rfq_id) 
      : (quote?.rfq_id ? rfqs.find((r) => r.id === quote.rfq_id) : null);
    
    // Find invoice either directly from shipment or via order
    const invoice = shipment.invoice_id 
      ? invoices.find((i) => i.id === shipment.invoice_id) 
      : (order ? invoices.find((i) => i.order_id === order.id) : null);

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
