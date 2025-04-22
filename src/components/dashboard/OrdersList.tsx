
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrdersFilters } from "./OrdersFilters";
import { OrdersTable } from "./OrdersTable";
import { mockOrders, columnHeaders } from "@/data/mockOrders";
import { Order } from "@/types/order";

export const OrdersList = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selected, setSelected] = useState<number[]>([]);
  const navigate = useNavigate();

  // Filter/search state
  const [search, setSearch] = useState("");
  const [quantityRange, setQuantityRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [partsStatusFilter, setPartsStatusFilter] = useState("");

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
            <OrdersTable
              filteredOrders={filteredOrders}
              selected={selected}
              isChecked={isChecked}
              toggleCheck={toggleCheck}
              handleOrderClick={handleOrderClick}
            />
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
