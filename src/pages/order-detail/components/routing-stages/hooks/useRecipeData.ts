
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RoutingStage } from "@/components/recipe/types/recipeMappingTypes";

/**
 * Fetches and processes recipe data with routing stages 
 */
export const useRecipeData = (uniqueRecipeIds: string[]) => {
  const { toast } = useToast();
  const [routingStages, setRoutingStages] = useState<Record<string, RoutingStage[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState<string | null>(null);
  
  // Add refs to prevent unnecessary refetching
  const prevUniqueRecipeIdsRef = useRef<string[]>([]);

  // Fetch routing stages only when uniqueRecipeIds change or are different
  useEffect(() => {
    // Skip if the recipe IDs are the same as last time (using JSON.stringify for deep comparison)
    if (JSON.stringify(prevUniqueRecipeIdsRef.current) === JSON.stringify(uniqueRecipeIds)) {
      return;
    }
    
    // Store current recipe IDs to compare next time
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
            console.log(`Recipe ${recipe.name} (${recipe.id}) has ${typedStages.length} routing stages`);
          } else {
            console.warn(`Recipe ${recipe.name} (${recipe.id}) has no routing stages or invalid format`, recipe.routing_stages);
            stagesMap[recipe.id] = [];
          }
        });
        
        setRoutingStages(stagesMap);
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

  return {
    routingStages,
    loading,
    loadingErrorMessage,
    setLoadingErrorMessage
  };
};
