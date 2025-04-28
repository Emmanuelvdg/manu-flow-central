
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '../validation/productFormSchema';
import { ProductVariant, VariantType } from '../types/product';

interface UseProductSubmissionProps {
  productId: string;
  onClose: () => void;
  existingVariantsLoaded: boolean;
}

export function useProductSubmission({ 
  productId, 
  onClose, 
  existingVariantsLoaded 
}: UseProductSubmissionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: ProductFormData,
    variants: ProductVariant[],
    variantTypes: VariantType[]
  ) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting product update with image URL:', data.image);
      
      const productData: any = {
        name: data.name,
        category: data.category,
        price: Number(data.price),
        lead_time: data.lead_time,
        image: data.image || null,
        hasvariants: data.hasvariants,
        updated_at: new Date().toISOString(),
      };
      
      if (data.hasvariants) {
        if (variantTypes.length === 0 || variantTypes.every(t => t.options.length === 0)) {
          toast({
            title: 'Error',
            description: 'You need to define at least one variant type with options',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
        
        productData.varianttypes = variantTypes;
      } else {
        productData.varianttypes = null;
      }
      
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select();

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      if (data.hasvariants) {
        const variantIds = variants.map(v => v.id);
        
        if (existingVariantsLoaded && variantIds.length > 0) {
          await supabase
            .from('product_variants')
            .delete()
            .eq('product_id', productId)
            .not('id', 'in', `(${variantIds.join(',')})`);
        }
        
        for (const variant of variants) {
          const variantData = {
            sku: variant.sku,
            attributes: variant.attributes,
            price: variant.price,
            image: variant.image,
            inventory: variant.inventory,
            product_id: productId
          };
          
          if (variant.id && variant.id.startsWith('variant-')) {
            await supabase
              .from('product_variants')
              .insert(variantData);
          } else {
            await supabase
              .from('product_variants')
              .update(variantData)
              .eq('id', variant.id);
          }
        }
      } else if (existingVariantsLoaded) {
        await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', productId);
      }
      
      toast({
        title: 'Success',
        description: `${data.name} has been updated.`,
      });
      
      onClose();
    } catch (err) {
      console.error('Unexpected error during product update:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}
