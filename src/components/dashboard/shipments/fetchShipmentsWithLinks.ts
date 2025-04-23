
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all shipments and associated RFQ, Quote, Order, and Invoice data.
 * @returns {Promise<any[]>} shipment dashboard data
 */
export async function fetchShipmentsWithLinks() {
  // Get all shipments
  const { data: shipments, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!shipments || shipments.length === 0) return [];

  // Collect order_ids from shipments
  const orderIds = shipments.map((s) => s.order_id).filter(Boolean);

  // Fetch related orders
  let orders: any[] = [];
  let quotes: any[] = [];
  let rfqs: any[] = [];
  let invoices: any[] = [];

  if (orderIds.length > 0) {
    // Fetch orders
    const { data: dbOrders, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .in("id", orderIds);

    if (orderErr) throw new Error(orderErr.message);
    orders = dbOrders ?? [];

    // Fetch quotes from orders
    const quoteIds = orders.map((o) => o.quote_id).filter(Boolean);

    if (quoteIds.length > 0) {
      const { data: dbQuotes, error: quoteErr } = await supabase
        .from("quotes")
        .select("*")
        .in("id", quoteIds);

      if (quoteErr) throw new Error(quoteErr.message);
      quotes = dbQuotes ?? [];

      // Fetch rfqs from quotes
      const rfqIds = quotes.map((q) => q.rfq_id).filter(Boolean);

      if (rfqIds.length > 0) {
        const { data: dbRFQs, error: rfqErr } = await supabase
          .from("rfqs")
          .select("*")
          .in("id", rfqIds);

        if (rfqErr) throw new Error(rfqErr.message);
        rfqs = dbRFQs ?? [];
      }
    }

    // Fetch invoices from orders
    const { data: dbInvoices, error: invoiceErr } = await supabase
      .from("invoices")
      .select("*")
      .in("order_id", orderIds);

    if (invoiceErr) throw new Error(invoiceErr.message);
    invoices = dbInvoices ?? [];
  }

  // Build dashboard rows with links
  return shipments.map((shipment) => {
    const order = orders.find((o) => o.id === shipment.order_id) ?? {};
    const quote = quotes.find((q) => q.id === order.quote_id) ?? {};
    const rfq = rfqs.find((r) => r.id === quote.rfq_id) ?? {};
    const invoice = invoices.find((inv) => inv.order_id === shipment.order_id) ?? {};

    return {
      ...shipment,
      order_id: order.id ?? null,
      order_number: order.order_number ?? null,
      quote_id: quote.id ?? null,
      quote_number: quote.quote_number ?? null,
      rfq_id: rfq.id ?? null,
      rfq_number: rfq.rfq_number ?? null,
      invoice_id: invoice?.id ?? null,
      invoice_number: invoice?.invoice_number ?? null,
      eta: shipment.delivery_date,
      delivery_date: shipment.delivery_date,
    };
  });
}

