
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

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
};

interface OrderProductsProgressProps {
  productsLoading: boolean;
  orderProducts: OrderProductRow[];
}

export const OrderProductsProgress: React.FC<OrderProductsProgressProps> = ({
  productsLoading,
  orderProducts,
}) => (
  <div className="border rounded-lg p-4 space-y-4">
    <h3 className="font-semibold">Products & Progress</h3>
    {productsLoading ? (
      <div className="text-muted-foreground italic text-center py-2">Loading products...</div>
    ) : orderProducts.length === 0 ? (
      <div className="text-gray-500 italic text-center py-2">No products found</div>
    ) : (
      orderProducts.map((product, idx: number) => (
        <div key={product.id} className="border-b last:border-0 pb-4 last:pb-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{product.product_name || "Unknown Product"}</h4>
              <p className="text-sm text-gray-600">
                Quantity: {product.quantity} {product.unit} | Group: {product.group || "General"}
              </p>
              {product.product_description && (
                <p className="text-xs text-muted-foreground">{product.product_description}</p>
              )}
            </div>
            <Link 
              to={product.recipe_id ? `/recipes/${product.recipe_id}` : "#"}
              className={`text-sm ${product.recipe_id ? "text-blue-600 hover:underline" : "text-gray-400 cursor-not-allowed"}`}
              tabIndex={product.recipe_id ? 0 : -1}
              aria-disabled={!product.recipe_id}
            >
              View Recipe
            </Link>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Materials</span>
                <span>{product.materials_progress ?? 0}%</span>
              </div>
              <Progress value={product.materials_progress ?? 0} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Personnel</span>
                <span>{product.personnel_progress ?? 0}%</span>
              </div>
              <Progress value={product.personnel_progress ?? 0} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Machines</span>
                <span>{product.machines_progress ?? 0}%</span>
              </div>
              <Progress value={product.machines_progress ?? 0} />
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);
