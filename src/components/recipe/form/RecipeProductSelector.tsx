
import React from "react";
import { RecipeProductSelect } from "../RecipeProductSelect";
import { RecipeCustomProductDisplay } from "./RecipeCustomProductDisplay";
import { RecipeVariantSection } from "./RecipeVariantSection";
import type { CustomProduct } from "@/pages/quote-detail/components/custom-product/types";

interface RecipeProductSelectorProps {
  customProduct?: CustomProduct;
  productList: any[];
  productId: string;
  handleProductChange: (id: string) => void;
  isEditing: boolean;
  loading: boolean;
  productVariants: any[];
  selectedVariantId: string;
  setSelectedVariantId: (id: string) => void;
}

export const RecipeProductSelector: React.FC<RecipeProductSelectorProps> = ({
  customProduct,
  productList,
  productId,
  handleProductChange,
  isEditing,
  loading,
  productVariants,
  selectedVariantId,
  setSelectedVariantId
}) => {
  return (
    <>
      {!customProduct ? (
        <RecipeProductSelect
          productList={productList}
          productId={productId}
          onProductChange={handleProductChange}
          disabled={isEditing || loading}
          loading={loading}
        />
      ) : (
        <RecipeCustomProductDisplay customProduct={customProduct} />
      )}
      
      {/* Product Variant Selection */}
      <RecipeVariantSection 
        productVariants={productVariants}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        disabled={loading}
        showVariantSection={productVariants.length > 0 && !customProduct}
      />
    </>
  );
};
