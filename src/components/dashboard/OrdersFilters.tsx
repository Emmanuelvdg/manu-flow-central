
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  quantityRange: { min: string; max: string };
  setQuantityRange: (range: { min: string; max: string }) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  partsStatusFilter: string;
  setPartsStatusFilter: (value: string) => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  search,
  setSearch,
  quantityRange,
  setQuantityRange,
  statusFilter,
  setStatusFilter,
  partsStatusFilter,
  setPartsStatusFilter,
}) => {
  const clearFilters = () => {
    setSearch("");
    setQuantityRange({ min: "", max: "" });
    setStatusFilter("");
    setPartsStatusFilter("");
  };

  return (
    <tr>
      <td colSpan={4} className="p-2 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm border-gray-200"
          />
        </div>
      </td>
      <td className="p-2 border-b bg-gray-50">
        <div className="flex gap-1 items-center">
          <Input
            className="w-16 h-8 text-sm border-gray-200"
            placeholder="min"
            value={quantityRange.min}
            onChange={(e) =>
              setQuantityRange({ ...quantityRange, min: e.target.value })
            }
          />
          <span className="mx-1 text-gray-400">-</span>
          <Input
            className="w-16 h-8 text-sm border-gray-200"
            placeholder="max"
            value={quantityRange.max}
            onChange={(e) =>
              setQuantityRange({ ...quantityRange, max: e.target.value })
            }
          />
        </div>
      </td>
      <td className="p-2 border-b bg-gray-50">
        <select
          className="w-full h-8 text-sm rounded-md border border-gray-200 bg-white px-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          <option>Scheduled</option>
          <option>Done</option>
        </select>
      </td>
      <td className="p-2 border-b bg-gray-50">
        <select
          className="w-full h-8 text-sm rounded-md border border-gray-200 bg-white px-2"
          value={partsStatusFilter}
          onChange={(e) => setPartsStatusFilter(e.target.value)}
        >
          <option value="">Parts status</option>
          <option>Not booked</option>
          <option>Not enough</option>
          <option>Requested</option>
          <option>Delayed</option>
          <option>Expected</option>
          <option>Received</option>
        </select>
      </td>
      <td colSpan={2} className="p-2 border-b bg-gray-50 text-right">
        <Button
          size="sm"
          variant="outline"
          onClick={clearFilters}
          className="h-8"
        >
          Clear
        </Button>
      </td>
    </tr>
  );
};
