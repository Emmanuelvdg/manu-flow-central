
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MaterialStatusSectionProps {
  orderPartsStatus: string;
  getStatusBadgeColor: (status: string) => string;
  handleCheckMaterials: () => Promise<void>;
  handleAllocateMaterials?: () => Promise<void>;
  checking: boolean;
  allocating?: boolean;
  productsLoading: boolean;
}

export const MaterialStatusSection: React.FC<MaterialStatusSectionProps> = ({
  orderPartsStatus,
  getStatusBadgeColor,
  handleCheckMaterials,
  handleAllocateMaterials,
  checking,
  allocating = false,
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
      
      {orderPartsStatus === 'booked' && handleAllocateMaterials && (
        <Button
          onClick={handleAllocateMaterials}
          disabled={allocating || checking || productsLoading}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          {allocating ? 'Allocating...' : 'Allocate Materials'}
        </Button>
      )}
    </div>
  );
};
