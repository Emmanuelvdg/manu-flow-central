
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Plus, Edit, Download, Printer, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Data structure for orders (matching the sample image)
const mockOrders = [
  {
    number: "MO00199",
    groupName: "Food: Finished goods",
    partNo: "PFP_5L",
    partDescription: "Packaged Food Product, 5L Canister",
    quantity: "10 pcs",
    status: "Scheduled",
    partsStatus: "Not booked",
    partsStatusColor: "bg-red-100 text-red-500",
    statusColor: "text-orange-500",
    editable: true,
    checked: false,
  },
  {
    number: "MO00198",
    groupName: "Food: Finished goods",
    partNo: "PFP_5L",
    partDescription: "Packaged Food Product, 5L Canister",
    quantity: "200 pcs",
    status: "Scheduled",
    partsStatus: "Requested",
    partsStatusColor: "bg-orange-100 text-orange-500",
    statusColor: "text-orange-500",
    editable: true,
    checked: false,
  },
  {
    number: "MO00197",
    groupName: "Food: Half-products",
    partNo: "BBFP",
    partDescription: "Base Bulk Food Product",
    quantity: "1000 kg",
    status: "Scheduled",
    partsStatus: "Received",
    partsStatusColor: "bg-green-100 text-green-600",
    statusColor: "",
    editable: true,
    checked: false,
  },
  {
    number: "MO00196",
    groupName: "Mechanical: Finished goods",
    partNo: "FA",
    partDescription: "Final assembly",
    quantity: "10 pcs",
    status: "Scheduled",
    partsStatus: "Received",
    partsStatusColor: "bg-green-100 text-green-600",
    statusColor: "",
    editable: true,
    checked: false,
  },
  {
    number: "MO00195",
    groupName: "Food: Half-products",
    partNo: "BBFP",
    partDescription: "Base Bulk Food Product",
    quantity: "100 kg",
    status: "Done",
    partsStatus: "Received",
    partsStatusColor: "bg-green-100 text-green-600",
    statusColor: "text-blue-800",
    editable: true,
    checked: false,
  },
  {
    number: "MO00192",
    groupName: "Tables: Finished goods",
    partNo: "WT",
    partDescription: "Wooden Table",
    quantity: "200 pcs",
    status: "Done",
    partsStatus: "Received",
    partsStatusColor: "bg-green-100 text-green-600",
    statusColor: "text-blue-800",
    editable: true,
    checked: true,
  },
  {
    number: "MO00191",
    groupName: "Tables: Finished goods",
    partNo: "WT",
    partDescription: "Wooden Table",
    quantity: "100 pcs",
    status: "Done",
    partsStatus: "Received",
    partsStatusColor: "bg-green-100 text-green-600",
    statusColor: "text-blue-800",
    editable: true,
    checked: true,
  },
];

const columnHeaders = [
  { key: "number", label: "Number", className: "pl-4 w-24" },
  { key: "groupName", label: "Group name" },
  { key: "partNo", label: "Part No." },
  { key: "partDescription", label: "Part description" },
  { key: "quantity", label: "Quantity" },
  { key: "status", label: "Status" },
  { key: "partsStatus", label: "Parts status" },
  { key: "actions", label: "" },
  { key: "select", label: "", className: "pr-4 text-center w-8" },
];

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

  // Filtering logic (mock/demo only)
  const filteredOrders = orders.filter((order) => {
    // Apply top search bar
    if (
      search &&
      !Object.values(order)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    // Filter by status dropdown
    if (statusFilter && order.status !== statusFilter) return false;
    // Filter by parts status dropdown
    if (partsStatusFilter && order.partsStatus !== partsStatusFilter) return false;
    // Quantity range - simplistic check (actual parsing may vary in live)
    const qtyNum = parseInt(order.quantity);
    if (quantityRange.min && qtyNum < parseInt(quantityRange.min)) return false;
    if (quantityRange.max && qtyNum > parseInt(quantityRange.max)) return false;
    return true;
  });

  // Table header filter row for min-max, status, parts status, etc.
  const renderHeaderFilterRow = () => (
    <tr className="bg-white shadow-sm border-b text-xs text-muted-foreground">
      <td />
      <td />
      <td />
      <td />
      <td className="px-2 py-1">
        <div className="flex gap-1">
          <input
            className="w-12 border rounded px-1 py-0.5 text-xs"
            placeholder="min"
            value={quantityRange.min}
            onChange={(e) =>
              setQuantityRange({ ...quantityRange, min: e.target.value })
            }
          />
          <span className="mx-1 text-muted-foreground">-</span>
          <input
            className="w-12 border rounded px-1 py-0.5 text-xs"
            placeholder="max"
            value={quantityRange.max}
            onChange={(e) =>
              setQuantityRange({ ...quantityRange, max: e.target.value })
            }
          />
        </div>
      </td>
      <td className="px-2 py-1">
        <select
          className="border rounded px-2 py-1 text-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          <option>Scheduled</option>
          <option>Done</option>
        </select>
      </td>
      <td className="px-2 py-1">
        <select
          className="border rounded px-2 py-1 text-xs"
          value={partsStatusFilter}
          onChange={(e) => setPartsStatusFilter(e.target.value)}
        >
          <option value="">Parts status</option>
          <option>Not booked</option>
          <option>Requested</option>
          <option>Received</option>
        </select>
      </td>
      <td />
      <td className="text-center px-2">
        <input
          type="checkbox"
          checked={selected.length === filteredOrders.length && filteredOrders.length > 0}
          onChange={() =>
            setSelected(
              selected.length === filteredOrders.length
                ? []
                : filteredOrders.map((_, idx) => idx)
            )
          }
        />
      </td>
    </tr>
  );

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
        {/* Search bar (top) */}
        <div className="flex items-center p-2 gap-2 border-b bg-gray-50">
          <div className="flex-1 flex items-center gap-2">
            <SearchIcon className="w-4 h-4 opacity-60" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 rounded border text-sm"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="ml-4"
            onClick={() => {
              setSearch("");
              setQuantityRange({ min: "", max: "" });
              setStatusFilter("");
              setPartsStatusFilter("");
            }}
          >
            Clear
          </Button>
        </div>
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
              {renderHeaderFilterRow()}
            </thead>
            <tbody>
              {/* Total row */}
              <tr className="bg-white text-lg border-b">
                <td colSpan={4} className="font-bold px-4 py-2 text-blue-900">
                  Total:
                </td>
                <td className="font-bold px-2 py-2 text-blue-900">
                  {/* Sum quantities */}
                  {mockOrders
                    .map((o) =>
                      (o.quantity.match(/\d+/g) || [])
                        .map(Number)
                        .reduce((a, b) => a + b, 0)
                    )
                    .reduce((a, b) => a + b, 0)}
                </td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={columnHeaders.length} className="text-center text-sm py-10">
                    No results.
                  </td>
                </tr>
              )}
              {filteredOrders.map((order, idx) => (
                <tr 
                  className="group hover:bg-blue-50 text-base border-b cursor-pointer" 
                  key={order.number}
                  onClick={() => handleOrderClick(order.number)}
                >
                  <td className={`pl-4 font-medium ${order.status === "Scheduled" ? "text-orange-600" : "text-blue-900"}`}>{order.number}</td>
                  <td className="text-xs">{order.groupName}</td>
                  <td className="text-xs">{order.partNo}</td>
                  <td className="text-xs">{order.partDescription}</td>
                  <td className="text-xs">{order.quantity}</td>
                  <td className={`text-xs ${order.statusColor || ""}`}>{order.status}</td>
                  {/* Parts status with colored tag */}
                  <td>
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs ${order.partsStatusColor}`}
                    >
                      {order.partsStatus}
                    </span>
                  </td>
                  <td className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderClick(order.number);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="pr-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked(idx)}
                      onChange={() => toggleCheck(idx)}
                      className="accent-blue-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paging (mock) */}
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
