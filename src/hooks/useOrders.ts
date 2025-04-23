
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import { parseOrderRow } from "@/utils/orderUtils";
import { useOrderFilters } from "./orders/useOrderFilters";
import { useOrderOperations } from "./orders/useOrderOperations";
import { useOrderSelection } from "./orders/useOrderSelection";

export const useOrders = () => {
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (fetchError) throw fetchError;
      
      console.log("Fetched orders:", data);
      return data ? data.map(parseOrderRow) : [];
    }
  });

  const { selected, setSelected } = useOrderSelection();
  const { resetAndRecreatAllOrders, syncAcceptedQuotes } = useOrderOperations(refetch);
  const {
    filteredOrders,
    search,
    setSearch,
    quantityRange,
    setQuantityRange,
    statusFilter,
    setStatusFilter,
    partsStatusFilter,
    setPartsStatusFilter,
  } = useOrderFilters(orders);

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    selected,
    setSelected,
    search,
    setSearch,
    quantityRange,
    setQuantityRange,
    statusFilter,
    setStatusFilter,
    partsStatusFilter,
    setPartsStatusFilter,
    syncAcceptedQuotes,
    resetAndRecreatAllOrders,
    refetch
  };
};
