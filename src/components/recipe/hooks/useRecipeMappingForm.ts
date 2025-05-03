
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
  const machineMgmt = useMachineManagement();
  const routingStagesMgmt = useRoutingStagesManagement();
  
  // Set initial values from existing recipe
  useEffect(() => {
    if (initialRecipe) {
      materialsMgmt.setMaterials(initialRecipe.materials || []);
      
      // For backwards compatibility, map existing personnel and machines to stages if needed
      let existingStages = initialRecipe.routing_stages || [];
      const existingPersonnel = initialRecipe.personnel || [];
      const existingMachines = initialRecipe.machines || [];
      
      // If we have stages but no personnel/machines inside them, distribute the existing ones
      if (existingStages.length > 0 && existingPersonnel.length > 0) {
        if (!existingStages[0].personnel) {
          // Old format - personnel is at root level, not in stages
          // Put all personnel in the first stage for now
          existingStages = existingStages.map((stage, index) => ({
            ...stage,
            personnel: index === 0 ? existingPersonnel : [],
            machines: index === 0 ? existingMachines : []
          }));
        }
      } else if (existingStages.length === 0 && (existingPersonnel.length > 0 || existingMachines.length > 0)) {
        // No stages but we have personnel/machines
        // Create a default stage to hold them
        existingStages = [{
          id: `temp-${Date.now()}`,
          stage_id: 'default',
          stage_name: 'Production',
          hours: 1,
          personnel: existingPersonnel,
          machines: existingMachines
        }];
      }
      
      routingStagesMgmt.setRoutingStages(existingStages);
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
      personnel: [], // Now managed within stages
      machines: [], // Now managed within stages
      routingStages: routingStagesMgmt.routingStages,
      variantId: formState.variantId
    };
    
    handleSubmit(formData);
  };

  // Extract all personnel from stages for compatibility with existing code
  const getAllPersonnel = () => {
    return routingStagesMgmt.routingStages.flatMap(stage => stage.personnel || []);
  };

  // Extract all machines from stages for compatibility with existing code
  const getAllMachines = () => {
    return routingStagesMgmt.routingStages.flatMap(stage => stage.machines || []);
  };

  return {
    ...formState,
    ...referenceData,
    ...materialsMgmt,
    ...personnelMgmt,
    ...machineMgmt,
    ...routingStagesMgmt,
    // Virtual properties for compatibility
    personnel: getAllPersonnel(),
    machines: getAllMachines(),
    loading,
    isEditing,
    handleSubmit: handleFormSubmit
  };
};
