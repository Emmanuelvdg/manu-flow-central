import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderSummaryRow, OrderSummarySummary, OrderLogistics } from "@/types/orderSummary";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";

interface UseOrderSummaryDataProps {
  startMonth: Date;
  endMonth: Date;
}

export const useOrderSummaryData = ({ startMonth, endMonth }: UseOrderSummaryDataProps) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["order-summary-report", startMonth, endMonth],
    queryFn: async () => {
      const startDate = startOfMonth(startMonth).toISOString();
      const endDate = endOfMonth(endMonth).toISOString();

      // Fetch orders within date range
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .gte("order_date", startDate)
        .lte("order_date", endDate)
        .order("order_date", { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch all logistics data
      const { data: logistics, error: logisticsError } = await supabase
        .from("order_logistics")
        .select("*");

      if (logisticsError) throw logisticsError;

      // Fetch invoices for payment tracking
      const { data: invoices, error: invoicesError } = await supabase
        .from("invoices")
        .select("order_id, amount, paid");

      if (invoicesError) throw invoicesError;

      // Process data
      const reportRows: OrderSummaryRow[] = (orders || []).map((order) => {
        const orderLogistics = logistics?.find((l) => l.order_id === order.id);
        const orderInvoices = invoices?.filter((i) => i.order_id === order.id) || [];
        
        const amountPaidToDate = orderInvoices.reduce(
          (sum, inv) => sum + (inv.paid ? Number(inv.amount) : 0),
          0
        );

        const paymentPercentage = order.total > 0 
          ? (amountPaidToDate / Number(order.total)) * 100 
          : 0;

        // Get quote for currency
        const currency = "USD"; // Default, could fetch from quotes table if needed

        return {
          orderId: order.id,
          orderNumber: order.order_number,
          buyer: order.customer_name,
          country: order.shipping_address || "",
          totalOrderValue: Number(order.total),
          currency,
          month: format(new Date(order.order_date), "MMM-yy"),
          orderDate: new Date(order.order_date),
          amountPaidToDate,
          paymentPercentage,
          containerType: (orderLogistics?.container_type as '20"' | '40"' | '40HC') || null,
          consol: orderLogistics?.consol ? Number(orderLogistics.consol) : null,
          forecastLoadDate: orderLogistics?.forecast_load_date 
            ? new Date(orderLogistics.forecast_load_date) 
            : null,
          tglLoadingDate: orderLogistics?.tgl_loading_date 
            ? new Date(orderLogistics.tgl_loading_date) 
            : null,
          incoterms: orderLogistics?.incoterms || null,
          qc: orderLogistics?.qc || null,
          pic: orderLogistics?.pic || null,
          notes: orderLogistics?.notes || null,
          port: orderLogistics?.port || null,
          logisticsId: orderLogistics?.id || null,
        };
      });

      // Calculate summary
      const summary: OrderSummarySummary = {
        totalOrders: reportRows.length,
        totalOrderValue: reportRows.reduce((sum, row) => sum + row.totalOrderValue, 0),
        totalPaid: reportRows.reduce((sum, row) => sum + row.amountPaidToDate, 0),
        outstandingAmount: reportRows.reduce(
          (sum, row) => sum + (row.totalOrderValue - row.amountPaidToDate),
          0
        ),
        containers: {
          '20"': reportRows.filter((r) => r.containerType === '20"').length,
          '40"': reportRows.filter((r) => r.containerType === '40"').length,
          '40HC': reportRows.filter((r) => r.containerType === '40HC').length,
        },
      };

      return { rows: reportRows, summary };
    },
  });

  const updateLogisticsMutation = useMutation({
    mutationFn: async ({
      orderId,
      field,
      value,
    }: {
      orderId: string;
      field: keyof OrderLogistics;
      value: any;
    }) => {
      const { data, error } = await supabase
        .from("order_logistics")
        .upsert(
          {
            order_id: orderId,
            [field]: value,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "order_id",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-summary-report"] });
      toast.success("Updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update:", error);
      toast.error("Failed to save changes");
    },
  });

  return {
    ...query,
    updateLogistics: updateLogisticsMutation.mutate,
    isUpdating: updateLogisticsMutation.isPending,
  };
};
