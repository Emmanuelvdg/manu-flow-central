
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductVariant, VariantType } from '../types/product';
import { parseJsonField } from '../utils/productUtils';

interface UseVariantManagementProps {
  productId: string;
  hasVariants: boolean;
}

export function useVariantManagement({ productId, hasVariants }: UseVariantManagementProps) {
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [existingVariantsLoaded, setExistingVariantsLoaded] = useState(false);

  useEffect(() => {
    if (!hasVariants || existingVariantsLoaded) return;
    
    const loadVariants = async () => {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productId);
          
        if (!error && data) {
          const mappedVariants = data.map(variant => ({
            id: variant.id,
            sku: variant.sku,
            attributes: variant.attributes as Record<string, string>,
            price: variant.price,
            image: variant.image || undefined,
            inventory: variant.inventory || undefined,
            product_id: variant.product_id
          }));
          
          setVariants(mappedVariants);
          setExistingVariantsLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load variants:', err);
      }
    };
    
    loadVariants();
  }, [productId, hasVariants, existingVariantsLoaded]);

  return {
    variantTypes,
    variants,
    setVariantTypes,
    setVariants,
    existingVariantsLoaded
  };
}
