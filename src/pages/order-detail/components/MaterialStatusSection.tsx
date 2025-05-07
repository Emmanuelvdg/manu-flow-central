
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface MaterialStatusSectionProps {
  orderPartsStatus: string;
  getStatusBadgeColor: (status: string) => string;
  handleCheckMaterials: () => Promise<void>;
  checking: boolean;
  productsLoading: boolean;
}

export const MaterialStatusSection: React.FC<MaterialStatusSectionProps> = ({
  orderPartsStatus,
  getStatusBadgeColor,
  handleCheckMaterials,
  checking,
  productsLoading
}) => {
  return (
    <div className="flex items-center gap-4">
      <Badge 
        variant="outline" 
        className={getStatusBadgeColor(orderPartsStatus)}
      >
        {orderPartsStatus}
      </Badge>
      <Button
        onClick={handleCheckMaterials}
        disabled={checking || productsLoading}
        className="gap-2"
      >
        <CheckCircle className="h-4 w-4" />
        {checking ? 'Checking...' : 'Check Materials'}
      </Button>
    </div>
  );
};
