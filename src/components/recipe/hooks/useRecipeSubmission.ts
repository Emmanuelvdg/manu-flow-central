import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { RecipeMappingFormData } from '../types/recipeMappingTypes';
import type { Material, Personnel, Machine, RoutingStage } from '../types/recipeMappingTypes';
import type { CustomProduct } from '@/pages/quote-detail/components/custom-product/types';

export const useRecipeSubmission = (
  initialRecipe: any,
  onSuccess: () => void,
  onClose: () => void,
  returnToQuote?: boolean,
  customProduct?: CustomProduct
) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const isEditing = !!initialRecipe?.id;

  const handleSubmit = async (formData: RecipeMappingFormData, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    try {
      let recipeData: any = {
        name: formData.name,
        description: formData.description,
        materials: formData.materials,
        personnel: formData.personnel,
        machines: formData.machines,
        routing_stages: formData.routingStages,
      };
      
      // Handle custom product case
      if (customProduct) {
        recipeData.custom_product = true;
        recipeData.custom_product_name = customProduct.name;
        recipeData.custom_product_id = customProduct.id;
      }
      // Handle regular product case
      else if (formData.productId) {
        recipeData.product_id = formData.productId;
        recipeData.product_name = formData.productName;
        if (formData.variantId) {
          recipeData.variantId = formData.variantId;
        }
      }

      if (isEditing) {
        await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', initialRecipe.id);
      } else {
        await supabase.from('recipes').insert([recipeData]);
      }
      
      onSuccess();
      
      // If returnToQuote is true and we're on a quote page, stay there
      if (returnToQuote) {
        onClose();
      } else {
        // Otherwise, navigate to recipes dashboard
        navigate('/recipes');
      }
      
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    isEditing
  };
};
