
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ProductRoutingStages } from "./routing-stages/ProductRoutingStages";

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

interface ProductRowProps {
  product: OrderProductRow;
  refetch: () => Promise<void>;
  getStatusBadgeColor: (status: string) => string;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  refetch,
  getStatusBadgeColor
}) => {
  return (
    <div className="border rounded-lg last:border-0 p-4 mb-4">
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
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={getStatusBadgeColor(product.status)}>
            {product.status.replace('_', ' ')}
          </Badge>
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
      </div>
      
      {/* Production stages for this product */}
      {product.recipe_id && (
        <ProductRoutingStages 
          recipeId={product.recipe_id}
          orderProduct={product}
          refetch={refetch}
        />
      )}
    </div>
  );
};
