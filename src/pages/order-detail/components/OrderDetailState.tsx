
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderDetailStateProps {
  isLoading?: boolean;
  error?: Error | null;
}

export const OrderDetailState: React.FC<OrderDetailStateProps> = ({ isLoading, error }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="py-4 text-center">Loading order details...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-red-500 py-4 text-center">
            Error loading order: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
