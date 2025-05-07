
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Manages and updates stage progress for order products
 */
export const useStageProgress = (orderProducts: any[], tabValue: string) => {
  const { toast } = useToast();
  const [stageProgress, setStageProgress] = useState<Record<string, Record<string, number>>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  // Update progress values to prevent loops
  useEffect(() => {
    if (orderProducts.length === 0) {
      return;
    }
    
    const newProgress = { ...stageProgress };
    let hasChanges = false;
    
    orderProducts.forEach(product => {
      if (product.recipe_id && product.recipes?.routing_stages) {
        // For each stage in the recipe, set the progress based on the product's progress fields
        (product.recipes.routing_stages || []).forEach((stage: any) => {
          if (!newProgress[product.recipe_id]) {
            newProgress[product.recipe_id] = {};
          }
          
          // Set progress based on selected tab
          let currentProgress = 0;
          if (tabValue === 'materials') {
            currentProgress = product.materials_progress || 0;
          } else if (tabValue === 'personnel') {
            currentProgress = product.personnel_progress || 0;
          } else if (tabValue === 'machines') {
            currentProgress = product.machines_progress || 0;
          } else {
            // Default to materials progress for the "stages" tab
            currentProgress = product.materials_progress || 0;
          }
          
          if (newProgress[product.recipe_id][stage.id] !== currentProgress) {
            newProgress[product.recipe_id][stage.id] = currentProgress;
            hasChanges = true;
          }
        });
      }
    });
    
    // Only update state if there are actual changes
    if (hasChanges) {
      setStageProgress(newProgress);
    }
  }, [orderProducts, tabValue]);

  const handleProgressChange = (
    recipeId: string, 
    stageId: string, 
    progressType: 'materials' | 'personnel' | 'machines', 
    value: number
  ) => {
    // Update local progress state
    setStageProgress(prev => {
      const updatedProgress = { ...prev };
      if (!updatedProgress[recipeId]) {
        updatedProgress[recipeId] = {};
      }
      updatedProgress[recipeId][stageId] = value;
      return updatedProgress;
    });
  };

  const handleUpdateProgress = async (recipeId: string, stageId: string, orderProductId: string) => {
    // Get the progress value for this stage
    const progress = stageProgress[recipeId]?.[stageId] || 0;
    
    setIsUpdating(prev => ({ ...prev, [`${recipeId}-${stageId}`]: true }));
    
    try {
      // Find which product this recipe belongs to
      const orderProduct = orderProducts.find(product => product.recipe_id === recipeId);
      if (!orderProduct) throw new Error("Order product not found");
      
      // Update the progress in the database
      const { error } = await supabase
        .from('order_products')
        .update({ 
          // Update the appropriate progress field based on tab selection
          ...(tabValue === 'materials' ? { materials_progress: progress } : {}),
          ...(tabValue === 'personnel' ? { personnel_progress: progress } : {}),
          ...(tabValue === 'machines' ? { machines_progress: progress } : {})
        })
        .eq('id', orderProductId);
      
      if (error) throw error;
      
      toast({
        title: "Progress updated",
        description: `${tabValue.charAt(0).toUpperCase() + tabValue.slice(1)} progress updated to ${progress}%`,
      });
      
    } catch (err) {
      console.error("Error updating progress:", err);
      toast({
        title: "Error updating progress",
        description: "Could not update progress information",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [`${recipeId}-${stageId}`]: false }));
    }
  };

  return {
    stageProgress,
    isUpdating,
    handleProgressChange,
    handleUpdateProgress
  };
};
