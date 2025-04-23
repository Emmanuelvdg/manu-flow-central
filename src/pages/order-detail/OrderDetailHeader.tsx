
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface OrderDetailHeaderProps {
  orderId: string;
}

export const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({ orderId }) => {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link to="/orders">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Link>
    </Button>
  );
};
