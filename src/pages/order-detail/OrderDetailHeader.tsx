
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface OrderDetailHeaderProps {
  orderId: string;
  orderDate?: string;
  customerName?: string;
  status?: string;
  MaterialStatusSection?: React.ReactNode;
}

export const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({ 
  orderId,
  orderDate,
  customerName,
  status,
  MaterialStatusSection
}) => {
  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" asChild>
        <Link to="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>
      
      {customerName && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">{customerName}</h2>
            {orderDate && <p className="text-muted-foreground">Order Date: {new Date(orderDate).toLocaleDateString()}</p>}
            {status && <p className="text-muted-foreground">Status: {status}</p>}
          </div>
          
          {MaterialStatusSection && (
            <div>{MaterialStatusSection}</div>
          )}
        </div>
      )}
    </div>
  );
};
