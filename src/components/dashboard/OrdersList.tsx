
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrdersFilters } from "./OrdersFilters";
import { OrdersTable } from "./OrdersTable";
import { columnHeaders } from "@/data/mockOrders";
import { Order } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";

const parseOrderRow = (row: any): Order => ({
  number: row.order_number || "-",
  groupName: "-", // Placeholder since groupName is not in 'orders' table
  partNo: "-",    // Placeholder
  partDescription: "-", // Placeholder
  quantity: row.products && Array.isArray(row.products) && row.products.length > 0 && typeof row.products[0].quantity === 'string'
    ? row.products[0].quantity
    : row.products && Array.isArray(row.products) && row.products.length > 0
      ? String(row.products[0].quantity)
      : "-",
  status: row.status || "-",
  partsStatus: row.parts_status || "-",
  partsStatusColor: "", // You can fill this in based on the status if needed
  statusColor: "",      // You can fill this in based on the status if needed
  editable: true,
  checked: false,
});

export const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter/search state
  const [search, setSearch] = useState("");
  const [quantityRange, setQuantityRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [partsStatusFilter, setPartsStatusFilter] = useState("");

  // Fetch orders from Supabase
  useEffect(() => {
    setLoading(true);
    setError(null);
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then((result) => {
        if (result.error) {
          setError(result.error.message);
          setOrders([]);
        } else if (result.data) {
          const parsed = result.data.map(parseOrderRow);
          setOrders(parsed);
        } else {
          setOrders([]);
        }
        setLoading(false);
      });
  }, []);

  const isChecked = (idx: number) => selected.includes(idx);

  const toggleCheck = (idx: number) => {
    setSelected((sels) =>
      sels.includes(idx) ? sels.filter((i) => i !== idx) : [...sels, idx]
    );
  };

  const handleOrderClick = (orderNumber: string) => {
    navigate(`/orders/${orderNumber}`);
  };

  // Filtering logic
  const filteredOrders = orders.filter((order) => {
    if (
      search &&
      !Object.values(order)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    if (statusFilter && order.status !== statusFilter) return false;
    if (partsStatusFilter && order.partsStatus !== partsStatusFilter) return false;
    const qtyNum = parseInt(order.quantity);
    if (quantityRange.min && qtyNum < parseInt(quantityRange.min)) return false;
    if (quantityRange.max && qtyNum > parseInt(quantityRange.max)) return false;
    return true;
  });

  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4 pt-5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">Manufacturing orders</span>
          <Button size="sm" className="ml-4 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <Printer className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-0">
            <thead>
              <tr className="bg-white">
                {columnHeaders.map((col) => (
                  <th
                    key={col.key}
                    className={`text-xs font-semibold px-4 py-2 border-b border-gray-100 ${col.className || ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
              <OrdersFilters
                search={search}
                setSearch={setSearch}
                quantityRange={quantityRange}
                setQuantityRange={setQuantityRange}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                partsStatusFilter={partsStatusFilter}
                setPartsStatusFilter={setPartsStatusFilter}
              />
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={9} className="text-center py-12 text-blue-600">
                    Loading orders...
                  </td>
                </tr>
              </tbody>
            ) : error ? (
              <tbody>
                <tr>
                  <td colSpan={9} className="text-center py-12 text-red-600">
                    Error loading orders: {error}
                  </td>
                </tr>
              </tbody>
            ) : (
              <OrdersTable
                filteredOrders={filteredOrders}
                selected={selected}
                isChecked={isChecked}
                toggleCheck={toggleCheck}
                handleOrderClick={handleOrderClick}
              />
            )}
          </table>
          <div className="flex justify-center items-center mt-4 pb-4">
            <Button variant="link" size="sm" className="text-blue-700">
              Load more
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
