
import React from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
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
    <>
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
          onClick={clearFilters}
        >
          Clear
        </Button>
      </div>
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
        <td />
      </tr>
    </>
  );
};
