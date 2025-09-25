
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Order } from "@/types/order";

interface OrdersTableProps {
  filteredOrders: Order[];
  selected: number[];
  isChecked: (idx: number) => boolean;
  toggleCheck: (idx: number) => void;
  handleOrderClick: (orderNumber: string) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  filteredOrders,
  selected,
  isChecked,
  toggleCheck,
  handleOrderClick,
}) => {
  return (
    <tbody>
      <tr className="bg-white border-b">
        <td colSpan={4} className="px-4 py-3 font-semibold text-primary">
          Total:
        </td>
        <td className="px-4 py-3 font-semibold text-primary">
          {filteredOrders
            .map((o) => parseInt(o.quantity) || 0)
            .reduce((a, b) => a + b, 0)}
        </td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      {filteredOrders.length === 0 ? (
        <tr>
          <td colSpan={9} className="text-center text-sm py-10 text-gray-500">
            No work orders found. Try creating work orders from accepted quotes with the "Sync Work Orders" button.
          </td>
        </tr>
      ) : (
        filteredOrders.map((order, idx) => (
          <tr 
            key={order.number}
            onClick={() => handleOrderClick(order.number)}
            className="hover:bg-gray-50 border-b cursor-pointer"
          >
            <td className="px-4 py-3 text-sm font-medium text-primary truncate max-w-[140px]">
              {order.number}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[140px]">{order.groupName}</td>
            <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[100px]">{order.partNo}</td>
            <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[180px]">{order.partDescription}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{order.quantity}</td>
            <td className="px-4 py-3">
              <span className={`inline-block rounded-full px-2 py-1 text-xs ${order.statusColor} whitespace-nowrap`}>
                {order.status}
              </span>
            </td>
            <td className="px-4 py-3">
              <span className={`inline-block rounded-full px-2 py-1 text-xs ${order.partsStatusColor} whitespace-nowrap`}>
                {order.partsStatus}
              </span>
            </td>
            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <Button 
                size="icon" 
                variant="ghost"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrderClick(order.number);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </td>
            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isChecked(idx)}
                onChange={() => toggleCheck(idx)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
};
