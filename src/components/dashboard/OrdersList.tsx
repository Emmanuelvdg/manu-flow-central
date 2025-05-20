
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { OrdersFilters } from "./OrdersFilters";
import { OrdersTable } from "./OrdersTable";
import { OrdersHeader } from "./orders/OrdersHeader";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Table, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    syncAcceptedQuotes,
    resetAndRecreatAllOrders
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
    <Card className="bg-white shadow-sm">
      <OrdersHeader />
      <CardContent className="!p-0">
        <ScrollArea className="w-full" style={{ maxHeight: "calc(100vh - 220px)" }}>
          <div className="min-w-[1000px]">
            <table className="w-full table-fixed border-separate border-spacing-0">
              <thead>
                <tr className="bg-white border-b">
                  {["Number", "Group name", "Part No.", "Part description", "Quantity", "Status", "Parts status", "Actions", "Select"].map((header) => (
                    <th
                      key={header}
                      className="text-left text-xs font-semibold px-4 py-3 text-gray-600"
                    >
                      {header}
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
                    <td colSpan={9} className="text-center py-12 text-primary">
                      Loading orders...
                    </td>
                  </tr>
                </tbody>
              ) : error ? (
                <tbody>
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-destructive">
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
            <div className="flex justify-center items-center gap-4 mt-6 pb-6">
              <Button 
                variant="link" 
                size="sm" 
                className="text-primary"
                onClick={syncAcceptedQuotes}
              >
                Sync Orders
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={resetAndRecreatAllOrders}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset & Recreate All Orders
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/orders/quote-order-mapping')}
              >
                <Table className="w-4 h-4 mr-2" />
                View Quote-Order Mappings
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
