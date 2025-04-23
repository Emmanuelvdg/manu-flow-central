
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
      <tr className="bg-white text-lg border-b">
        <td colSpan={4} className="font-bold px-4 py-2 text-blue-900">
          Total:
        </td>
        <td className="font-bold px-2 py-2 text-blue-900">
          {filteredOrders
            .map((o) => parseInt(o.quantity) || 0)
            .reduce((a, b) => a + b, 0)}
        </td>
        <td />
        <td />
        <td />
        <td />
      </tr>
      {filteredOrders.length === 0 && (
        <tr>
          <td colSpan={9} className="text-center text-sm py-10">
            No orders found. Try creating orders from accepted quotes with the "Sync Orders" button.
          </td>
        </tr>
      )}
      {filteredOrders.map((order, idx) => (
        <tr 
          className="group hover:bg-blue-50 text-base border-b cursor-pointer" 
          key={order.number}
          onClick={() => handleOrderClick(order.number)}
        >
          <td className={`pl-4 font-medium ${order.status === "Scheduled" ? "text-orange-600" : "text-blue-900"}`}>
            {order.number}
          </td>
          <td className="text-xs">{order.groupName}</td>
          <td className="text-xs">{order.partNo}</td>
          <td className="text-xs">{order.partDescription}</td>
          <td className="text-xs">{order.quantity}</td>
          <td className={`text-xs ${order.statusColor || ""}`}>{order.status}</td>
          <td>
            <span className={`inline-block rounded px-2 py-1 text-xs ${order.partsStatusColor}`}>
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
  );
};
