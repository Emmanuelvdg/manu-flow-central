
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRecipeForm } from './useRecipeForm';
import { useRecipeSubmission } from './useRecipeSubmission';
import { useRecipeReferenceData } from './useRecipeReferenceData';
import { useMaterialsManagement } from './useMaterialsManagement';
import { usePersonnelManagement } from './usePersonnelManagement';
import { useMachineManagement } from './useMachineManagement';
import { useRoutingStagesManagement } from './useRoutingStagesManagement';
import type { CustomProduct } from '@/pages/quote-detail/components/CustomProductInput';
import type { RecipeMappingFormData } from '../types/recipeMappingTypes';

export const useRecipeMappingForm = (
  open: boolean, 
  initialRecipe: any, 
  onSuccess: () => void, 
  onClose: () => void,
  customProduct?: CustomProduct,
  returnToQuote?: boolean
) => {
  const formState = useRecipeForm(initialRecipe, customProduct);
  const { handleSubmit, loading, isEditing } = useRecipeSubmission(
    initialRecipe, 
    onSuccess, 
    onClose, 
    returnToQuote, 
    customProduct
  );
  const referenceData = useRecipeReferenceData(open);
  
  // Resource management hooks
  const materialsMgmt = useMaterialsManagement();
  const personnelMgmt = usePersonnelManagement();
  const machinesMgmt = useMachineManagement();
  const routingStagesMgmt = useRoutingStagesManagement();
  
  // Set initial values from existing recipe
  useEffect(() => {
    if (initialRecipe) {
      materialsMgmt.setMaterials(initialRecipe.materials || []);
      personnelMgmt.setPersonnel(initialRecipe.personnel || []);
      machinesMgmt.setMachines(initialRecipe.machines || []);
      routingStagesMgmt.setRoutingStages(initialRecipe.routing_stages || []);
    }
  }, [initialRecipe]);

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all form data
    const formData: RecipeMappingFormData = {
      productId: formState.productId,
      productName: referenceData.productList.find(p => p.id === formState.productId)?.name || '',
      name: formState.name,
      description: formState.description,
      materials: materialsMgmt.materials,
      personnel: personnelMgmt.personnel,
      machines: machinesMgmt.machines,
      routingStages: routingStagesMgmt.routingStages,
      variantId: formState.variantId
    };
    
    handleSubmit(formData);
  };

  // Return combined state and handlers from all hooks
  return {
    ...formState,
    ...referenceData,
    ...materialsMgmt,
    ...personnelMgmt,
    ...machinesMgmt,
    ...routingStagesMgmt,
    loading,
    isEditing,
    handleSubmit: handleFormSubmit
  };
};
