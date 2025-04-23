
import { useState } from "react";
import { Order } from "@/types/order";

export const useOrderFilters = (orders: Order[]) => {
  const [search, setSearch] = useState("");
  const [quantityRange, setQuantityRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [partsStatusFilter, setPartsStatusFilter] = useState("");

  const filteredOrders = orders.filter((order) => {
    if (search && !Object.values(order).join(" ").toLowerCase().includes(search.toLowerCase()))
      return false;
    if (statusFilter && order.status !== statusFilter) return false;
    if (partsStatusFilter && order.partsStatus !== partsStatusFilter) return false;
    const qtyNum = parseInt(order.quantity);
    if (quantityRange.min && qtyNum < parseInt(quantityRange.min)) return false;
    if (quantityRange.max && qtyNum > parseInt(quantityRange.max)) return false;
    return true;
  });

  return {
    filteredOrders,
    search,
    setSearch,
    quantityRange,
    setQuantityRange,
    statusFilter,
    setStatusFilter,
    partsStatusFilter,
    setPartsStatusFilter,
  };
};
