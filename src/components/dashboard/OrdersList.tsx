
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { OrdersFilters } from "./OrdersFilters";
import { OrdersTable } from "./OrdersTable";
import { OrdersHeader } from "./orders/OrdersHeader";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { columnHeaders } from "@/data/mockOrders";

export const OrdersList = () => {
  const navigate = useNavigate();
  const {
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
    syncAcceptedQuotes
  } = useOrders();

  const isChecked = (idx: number) => selected.includes(idx);

  const toggleCheck = (idx: number) => {
    setSelected((sels) =>
      sels.includes(idx) ? sels.filter((i) => i !== idx) : [...sels, idx]
    );
  };

  const handleOrderClick = (orderNumber: string) => {
    navigate(`/orders/${orderNumber}`);
  };

  return (
    <Card className="overflow-visible">
      <OrdersHeader />
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
            {isLoading ? (
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
                    Error loading orders: {error.toString()}
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
            <Button 
              variant="link" 
              size="sm" 
              className="text-blue-700" 
              onClick={syncAcceptedQuotes}
            >
              Sync Orders
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
