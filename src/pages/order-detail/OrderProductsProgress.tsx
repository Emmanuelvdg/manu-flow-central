
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { checkMaterialAvailability, updateOrderMaterialStatus } from "@/services/materialReservationService";
import { useMaterialBatches } from "@/components/resources/hooks/useMaterialBatches";

// Import our new components
import { MaterialStatusSection } from "./components/MaterialStatusSection";
import { InvoiceButton } from "./components/InvoiceButton";
import { ProductsList } from "./components/ProductsList";
import { getStatusBadgeColor } from "./components/StatusBadgeUtils";

// Types for normalized order product
type OrderProductRow = {
  id: string;
  product_id: string;
  quantity: number;
  unit: string;
  status: string;
  materials_status: string;
  notes: string | null;
  recipe_id: string | null;
  product_name: string | null;
  product_description: string | null;
  group: string | null;
  recipes?: {
    id: string;
    name: string;
    product_name: string;
  } | null;
};

interface OrderProductsProgressProps {
  productsLoading: boolean;
  orderProducts: OrderProductRow[];
  orderId: string;
  refetch: () => Promise<void>;
}

export const OrderProductsProgress: React.FC<OrderProductsProgressProps> = ({
  productsLoading,
  orderProducts,
  orderId,
  refetch
}) => {
  const { toast } = useToast();
  const { data: batches = [] } = useMaterialBatches();
  const [checking, setChecking] = React.useState(false);

  // Group batches by material ID
  const materialBatches = React.useMemo(() => {
    return batches.reduce((acc: any, batch) => {
      if (!acc[batch.materialId]) {
        acc[batch.materialId] = [];
      }
      acc[batch.materialId].push(batch);
      return acc;
    }, {});
  }, [batches]);

  // Check if all products are completed
  const allProductsCompleted = React.useMemo(() => {
    return orderProducts.length > 0 && 
           orderProducts.every(product => product.status === "completed");
  }, [orderProducts]);

  const handleCheckMaterials = async () => {
    try {
      setChecking(true);
      const status = await checkMaterialAvailability(orderProducts, materialBatches);
      await updateOrderMaterialStatus(orderId, status);
      
      toast({
        title: "Materials Checked",
        description: `Reservation status: ${status}`,
      });
    } catch (error) {
      console.error('Error checking materials:', error);
      toast({
        title: "Error",
        description: "Failed to check materials",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  // Get the order level material status
  const orderPartsStatus = orderProducts[0]?.materials_status || 'not booked';
  
  return (
    <div className="border rounded-lg p-4 space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Products & Progress</h3>
        <div className="flex items-center gap-4">
          <MaterialStatusSection
            orderPartsStatus={orderPartsStatus}
            getStatusBadgeColor={getStatusBadgeColor}
            handleCheckMaterials={handleCheckMaterials}
            checking={checking}
            productsLoading={productsLoading}
          />
          
          <InvoiceButton 
            orderId={orderId} 
            allProductsCompleted={allProductsCompleted} 
          />
        </div>
      </div>

      <ProductsList
        productsLoading={productsLoading}
        orderProducts={orderProducts}
        getStatusBadgeColor={getStatusBadgeColor}
        refetch={refetch}
      />
    </div>
  );
};
