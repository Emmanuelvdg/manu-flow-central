
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteOrderMapping } from "./QuoteOrderMapping";

interface OrderDetailStateProps {
  isLoading?: boolean;
  error?: Error | null;
  showMappings?: boolean;
}

export const OrderDetailState: React.FC<OrderDetailStateProps> = ({ 
  isLoading, 
  error, 
  showMappings = false 
}) => {
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
          {showMappings && (
            <div className="mt-4">
              <QuoteOrderMapping />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (showMappings) {
    return <QuoteOrderMapping />;
  }

  return null;
};
