
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkMaterialAvailability, updateOrderMaterialStatus } from "@/services/materialReservationService";
import { useMaterialBatches } from "@/components/resources/hooks/useMaterialBatches";

// Types for normalized order product
type OrderProductRow = {
  id: string;
  product_id: string;
  quantity: number;
  unit: string;
  status: string;
  materials_status: string;
  materials_progress: number | null;
  personnel_progress: number | null;
  machines_progress: number | null;
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
}

export const OrderProductsProgress: React.FC<OrderProductsProgressProps> = ({
  productsLoading,
  orderProducts,
  orderId
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

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'booked': return 'bg-green-100 text-green-800';
      case 'expected': return 'bg-blue-100 text-blue-800';
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-orange-100 text-orange-800';
      case 'not enough': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get the order level material status
  const orderPartsStatus = orderProducts[0]?.materials_status || 'not booked';
  
  return (
    <div className="border rounded-lg p-4 space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Products & Progress</h3>
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
      </div>

      {productsLoading ? (
        <div className="text-muted-foreground italic text-center py-2">Loading products...</div>
      ) : orderProducts.length === 0 ? (
        <div className="text-gray-500 italic text-center py-2">No products found for this order</div>
      ) : (
        orderProducts.map((product) => (
          <div key={product.id} className="border-b last:border-0 pb-4 last:pb-0 pt-2">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{product.product_name || "Unknown Product"}</h4>
                <p className="text-sm text-gray-600">
                  Quantity: {product.quantity} {product.unit} | Group: {product.group || "General"}
                </p>
                {product.product_description && (
                  <p className="text-xs text-muted-foreground mt-1">{product.product_description}</p>
                )}
                {product.notes && (
                  <p className="text-xs text-muted-foreground mt-1 italic">Notes: {product.notes}</p>
                )}
                <div className="mt-2">
                  <Badge variant="outline" className={
                    product.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    product.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }>
                    {product.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              {product.recipe_id ? (
                <Link 
                  to={`/recipes/${product.recipe_id}`}
                  className="text-sm text-blue-600 hover:underline hover:text-blue-800"
                >
                  View Recipe
                </Link>
              ) : (
                <span className="text-sm text-gray-400">No Recipe</span>
              )}
            </div>
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Materials</span>
                  <span>{product.materials_progress ?? 0}%</span>
                </div>
                <Progress value={product.materials_progress ?? 0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Personnel</span>
                  <span>{product.personnel_progress ?? 0}%</span>
                </div>
                <Progress value={product.personnel_progress ?? 0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Machines</span>
                  <span>{product.machines_progress ?? 0}%</span>
                </div>
                <Progress value={product.machines_progress ?? 0} className="h-2" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
