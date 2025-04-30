
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CustomProduct } from '@/pages/quote-detail/components/custom-product/types';

export const useRecipeForm = (
  initialRecipe: any,
  customProduct?: CustomProduct
) => {
  const navigate = useNavigate();
  const [productId, setProductId] = useState<string>(initialRecipe?.product_id || '');
  const [name, setName] = useState<string>(initialRecipe?.name || '');
  const [description, setDescription] = useState<string>(initialRecipe?.description || '');
  const [variantId, setVariantId] = useState<string>(initialRecipe?.variantId || '');
  const [loading, setLoading] = useState<boolean>(false);
  const isEditing = !!initialRecipe?.id;

  // Set initial form values for a custom product
  useEffect(() => {
    if (customProduct && customProduct.name) {
      // For custom products, we set name but leave productId empty
      setName(`Recipe for ${customProduct.name}`);
    }
  }, [customProduct]);

  // Handle product selection
  const handleProductChange = (productId: string) => {
    setProductId(productId);
    // Reset variant selection when product changes
    setVariantId('');
  };

  return {
    productId,
    name,
    description,
    variantId,
    loading,
    isEditing,
    setProductId,
    setName,
    setDescription,
    setVariantId,
    setLoading,
    handleProductChange
  };
};
