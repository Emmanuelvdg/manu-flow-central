
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { RecipeMappingFormData } from '../types/recipeMappingTypes';
import type { CustomProduct } from '@/pages/quote-detail/components/custom-product/types';

export const useRecipeSubmission = (
  initialRecipe: any,
  onSuccess: () => void,
  onClose: () => void,
  returnToQuote?: boolean,
  customProduct?: CustomProduct
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const isEditing = !!initialRecipe?.id;

  const handleSubmit = async (formData: RecipeMappingFormData) => {
    if (!formData.name) {
      toast({
        title: "Missing Information",
        description: "Please enter a name for the recipe.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.productId && !customProduct) {
      toast({
        title: "Missing Information",
        description: "Please select a product for the recipe.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log("Submitting recipe with data:", formData);
      
      // Serialize arrays to JSON-compatible objects for Supabase
      const recipeData = {
        product_id: formData.productId || 'custom',
        product_name: formData.productName || (customProduct?.name || 'Custom Product'),
        name: formData.name,
        description: formData.description,
        // Convert arrays to JSON-compatible format
        materials: JSON.parse(JSON.stringify(formData.materials || [])),
        routing_stages: JSON.parse(JSON.stringify(formData.routingStages || [])),
        // Include saved empty arrays as null for better DB storage
        personnel: null, // Now managed in routing stages
        machines: null,  // Now managed in routing stages
        "totalCost": formData.totalCost || 0
      };
      
      let recipe;
      if (isEditing) {
        // Update existing recipe
        const { data, error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', initialRecipe.id)
          .select()
          .single();
          
        if (error) throw error;
        recipe = data;
        
        toast({
          title: "Recipe Updated",
          description: `Recipe "${formData.name}" has been updated.`
        });
      } else {
        // Insert new recipe
        const { data, error } = await supabase
          .from('recipes')
          .insert(recipeData)
          .select()
          .single();
          
        if (error) throw error;
        recipe = data;
        
        toast({
          title: "Recipe Created",
          description: `Recipe "${formData.name}" has been created.`
        });
      }
      
      // Associate recipe with custom product if applicable
      if (customProduct?.id && recipe) {
        console.log(`Associating recipe ${recipe.id} with custom product ${customProduct.id}`);
        
        // We need to add the recipe_id field to the custom_products table
        // Since TypeScript doesn't know about it yet, we'll use a more generic approach
        const { error: updateError } = await supabase
          .from('custom_products')
          .update({ recipe_id: recipe.id } as any)
          .eq('id', customProduct.id);
          
        if (updateError) {
          console.error("Error associating recipe with custom product:", updateError);
        }
      }
      
      onSuccess();
      
      // Check if we should return to quote detail page
      if (returnToQuote && customProduct && 'quote_id' in customProduct) {
        // Return to quote detail page using type assertion
        navigate(`/quotes/${(customProduct as any).quote_id}`);
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "There was an error saving the recipe. Please try again.",
        variant: "destructive"
      });
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
