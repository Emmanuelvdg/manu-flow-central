
import React from "react";
import { ProductRow } from "./ProductRow";

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

interface ProductsListProps {
  productsLoading: boolean;
  orderProducts: OrderProductRow[];
  getStatusBadgeColor: (status: string) => string;
  refetch: () => Promise<void>;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  productsLoading,
  orderProducts,
  getStatusBadgeColor,
  refetch
}) => {
  if (productsLoading) {
    return <div className="text-muted-foreground italic text-center py-2">Loading products...</div>;
  }
  
  if (orderProducts.length === 0) {
    return <div className="text-gray-500 italic text-center py-2">No products found for this order</div>;
  }
  
  return (
    <>
      {orderProducts.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          getStatusBadgeColor={getStatusBadgeColor}
          refetch={refetch}
        />
      ))}
    </>
  );
};
