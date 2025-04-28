
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '../types/product';
import { productFormSchema, ProductFormData } from '../validation/productFormSchema';
import { useVariantManagement } from './useVariantManagement';
import { useProductSubmission } from './useProductSubmission';

interface UseProductFormProps {
  product: Product;
  onClose: () => void;
}

export function useProductForm({ product, onClose }: UseProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      category: product.category || '',
      price: product.price?.toString() || '',
      lead_time: product.lead_time || '',
      image: product.image || '',
      hasvariants: !!product.hasvariants,
    },
  });

  const hasVariants = form.watch('hasvariants');
  const basePrice = Number(form.watch('price')) || 0;

  const { 
    variantTypes, 
    variants, 
    setVariantTypes, 
    setVariants,
    existingVariantsLoaded 
  } = useVariantManagement({
    productId: product.id,
    hasVariants
  });

  const { isSubmitting, handleSubmit } = useProductSubmission({
    productId: product.id,
    onClose,
    existingVariantsLoaded
  });

  const onSubmit = async (data: ProductFormData) => {
    await handleSubmit(data, variants, variantTypes);
  };

  return {
    form,
    hasVariants,
    basePrice,
    isSubmitting,
    variants,
    variantTypes,
    setVariants,
    setVariantTypes,
    onSubmit
  };
}
