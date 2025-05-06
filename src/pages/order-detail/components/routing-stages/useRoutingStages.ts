
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoutingStage } from "@/components/recipe/types/recipeMappingTypes";

export const useRoutingStages = (orderProducts: any[], uniqueRecipeIds: string[]) => {
  const { toast } = useToast();
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [tabValue, setTabValue] = useState("stages");
  const [routingStages, setRoutingStages] = useState<Record<string, RoutingStage[]>>({});
  const [stageProgress, setStageProgress] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState<string | null>(null);
  
  // Add refs to prevent unnecessary refetching
  const prevUniqueRecipeIdsRef = useRef<string[]>([]);

  // Fetch routing stages only when uniqueRecipeIds change
  useEffect(() => {
    // Skip if the recipe IDs are the same as last time
    if (JSON.stringify(prevUniqueRecipeIdsRef.current) === JSON.stringify(uniqueRecipeIds)) {
      return;
    }
    
    prevUniqueRecipeIdsRef.current = [...uniqueRecipeIds];
    
    const fetchRoutingStages = async () => {
      setLoading(true);
      setLoadingErrorMessage(null);
      
      try {
        // Skip if no recipes
        if (uniqueRecipeIds.length === 0) {
          setLoading(false);
          return;
        }
        
        console.log("Fetching routing stages for recipes:", uniqueRecipeIds);
        
        // Fetch recipes with routing stages
        const { data: recipes, error } = await supabase
          .from('recipes')
          .select('id, name, routing_stages, product_name')
          .in('id', uniqueRecipeIds);
          
        if (error) {
          console.error("Error fetching recipes:", error);
          setLoadingErrorMessage("Failed to fetch recipe data");
          throw error;
        }
        
        console.log("Fetched recipes:", recipes);
        
        // Transform data
        const stagesMap: Record<string, RoutingStage[]> = {};
        const progressMap: Record<string, Record<string, number>> = {};
        
        recipes.forEach(recipe => {
          if (recipe.routing_stages && Array.isArray(recipe.routing_stages)) {
            // Ensure proper typing for routing stages by explicitly casting
            const typedStages: RoutingStage[] = recipe.routing_stages.map((stage: any) => ({
              id: stage.id || '',
              stage_id: stage.stage_id || '',
              stage_name: stage.stage_name || '',
              hours: stage.hours || 0,
              personnel: stage.personnel || [],
              machines: stage.machines || [],
              _isNew: stage._isNew || false
            }));
            
            stagesMap[recipe.id] = typedStages;
            
            // Initialize progress for each stage (default to 0)
            progressMap[recipe.id] = {};
            typedStages.forEach(stage => {
              progressMap[recipe.id][stage.id] = 0;
            });
            
            console.log(`Recipe ${recipe.name} (${recipe.id}) has ${typedStages.length} routing stages`);
          } else {
            console.warn(`Recipe ${recipe.name} (${recipe.id}) has no routing stages or invalid format`, recipe.routing_stages);
            stagesMap[recipe.id] = [];
            progressMap[recipe.id] = {};
          }
        });
        
        setRoutingStages(stagesMap);
        setStageProgress(progressMap);
      } catch (err) {
        console.error("Error fetching routing stages:", err);
        setLoadingErrorMessage("Could not load production stages information");
        toast({
          title: "Error loading production stages",
          description: "Could not load production stages information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoutingStages();
  }, [uniqueRecipeIds, toast]);

  // Separate effect for updating progress values to prevent loops
  useEffect(() => {
    if (orderProducts.length === 0 || Object.keys(routingStages).length === 0) {
      return;
    }
    
    const newProgress = { ...stageProgress };
    let hasChanges = false;
    
    orderProducts.forEach(product => {
      if (product.recipe_id && routingStages[product.recipe_id]) {
        // For each stage in the recipe, set the progress based on the product's progress fields
        routingStages[product.recipe_id].forEach(stage => {
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
  }, [orderProducts, routingStages, tabValue]);

  const handleToggleStage = (recipeId: string, stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [`${recipeId}-${stageId}`]: !prev[`${recipeId}-${stageId}`]
    }));
  };

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
    expandedStages,
    isUpdating,
    tabValue,
    setTabValue,
    routingStages,
    stageProgress,
    loading,
    loadingErrorMessage,
    handleToggleStage,
    handleProgressChange,
    handleUpdateProgress,
    setLoadingErrorMessage
  };
};
