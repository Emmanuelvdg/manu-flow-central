import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface StageProgressData {
  id: string;
  order_product_id: string;
  stage_id: string;
  stage_name: string;
  yet_to_start_units: number;
  in_progress_units: number;
  completed_units: number;
  total_units: number;
}

/**
 * Hook for managing unit-based progress tracking for routing stages
 */
export const useUnitProgress = (orderProducts: any[], routingStages: Record<string, any[]>, refetch?: () => Promise<void>) => {
  const { toast } = useToast();
  const [stageProgressData, setStageProgressData] = useState<StageProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log('🔍 useUnitProgress - Input data:', {
    orderProductsCount: orderProducts.length,
    routingStagesKeys: Object.keys(routingStages),
    routingStagesCount: Object.keys(routingStages).length,
    stageProgressDataCount: stageProgressData.length
  });
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  // Extract unique recipe IDs and create progress records for new order products
  const uniqueRecipeIds = useMemo(() => {
    return [...new Set(orderProducts.map(p => p.recipe_id).filter(Boolean))];
  }, [orderProducts]);

  // Fetch existing progress data
  const fetchStageProgress = async () => {
    if (orderProducts.length === 0) return;

    setIsLoading(true);
    try {
      const orderProductIds = orderProducts.map(p => p.id);
      
      const { data, error } = await supabase
        .from('order_stage_progress')
        .select('*')
        .in('order_product_id', orderProductIds);

      if (error) throw error;
      setStageProgressData(data || []);
    } catch (error) {
      console.error('Error fetching stage progress:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stage progress data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize progress records for order products that don't have them
  const initializeStageProgress = async () => {
    console.log('🚀 initializeStageProgress called:', {
      orderProductsCount: orderProducts.length,
      routingStagesAvailable: Object.keys(routingStages).length > 0,
      stageProgressDataCount: stageProgressData.length
    });

    for (const orderProduct of orderProducts) {
      console.log('🔍 Processing order product:', {
        productId: orderProduct.id,
        recipeId: orderProduct.recipe_id,
        hasRouting: !!routingStages[orderProduct.recipe_id]
      });

      if (!orderProduct.recipe_id || !routingStages[orderProduct.recipe_id]) {
        console.log('⚠️ Skipping product - no recipe_id or routing stages');
        continue;
      }

      const existingStages = stageProgressData.filter(
        p => p.order_product_id === orderProduct.id
      );

      const productRoutingStages = routingStages[orderProduct.recipe_id] || [];
      
      for (const stage of productRoutingStages) {
        // Use consistent stage key - prefer stage_id if available, fallback to id
        const stageKey = stage.stage_id || stage.id;
        const existingStage = existingStages.find(p => p.stage_id === stageKey);
        
        console.log('🔍 Processing stage:', {
          stageName: stage.stage_name,
          stageKey,
          hasExisting: !!existingStage
        });
        
        if (!existingStage) {
          console.log('➕ Creating new stage progress record for:', stage.stage_name);
          // Create new progress record
          const newProgressRecord = {
            order_product_id: orderProduct.id,
            stage_id: stageKey,
            stage_name: stage.stage_name,
            yet_to_start_units: orderProduct.quantity,
            in_progress_units: 0,
            completed_units: 0,
            total_units: orderProduct.quantity,
          };

          try {
            const { data, error } = await supabase
              .from('order_stage_progress')
              .insert(newProgressRecord)
              .select()
              .single();

            if (error) throw error;

            setStageProgressData(prev => [...prev, data]);
          } catch (error) {
            console.error('Error creating stage progress record:', error);
          }
        }
      }
    }
  };

  // Update stage progress
  const updateStageProgress = async (
    stageProgressId: string,
    updates: Partial<Pick<StageProgressData, 'yet_to_start_units' | 'in_progress_units' | 'completed_units'>>
  ) => {
    setIsUpdating(prev => ({ ...prev, [stageProgressId]: true }));

    try {
      const { data, error } = await supabase
        .from('order_stage_progress')
        .update(updates)
        .eq('id', stageProgressId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setStageProgressData(prev => 
        prev.map(item => item.id === stageProgressId ? data : item)
      );

      toast({
        title: "Progress updated",
        description: "Stage progress has been updated successfully",
      });

      // Optionally refetch order data
      if (refetch) {
        await refetch();
      }

    } catch (error) {
      console.error('Error updating stage progress:', error);
      toast({
        title: "Error",
        description: "Failed to update stage progress",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [stageProgressId]: false }));
    }
  };

  // Get progress data for a specific order product and stage
  const getStageProgress = (orderProductId: string, stageId: string): StageProgressData | null => {
    return stageProgressData.find(
      p => p.order_product_id === orderProductId && p.stage_id === stageId
    ) || null;
  };

  // Calculate overall progress for an order product
  const getOrderProductProgress = (orderProductId: string) => {
    const productProgress = stageProgressData.filter(p => p.order_product_id === orderProductId);
    
    if (productProgress.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const totalCompleted = productProgress.reduce((sum, p) => sum + p.completed_units, 0);
    const totalUnits = productProgress.reduce((sum, p) => sum + p.total_units, 0);
    
    return {
      completed: totalCompleted,
      total: totalUnits,
      percentage: totalUnits > 0 ? Math.round((totalCompleted / totalUnits) * 100) : 0
    };
  };

  // Effects
  useEffect(() => {
    console.log('📡 Effect: fetchStageProgress triggered', { orderProductsCount: orderProducts.length });
    if (orderProducts.length > 0) {
      fetchStageProgress();
    }
  }, [orderProducts]);

  useEffect(() => {
    console.log('🔄 Effect: initializeStageProgress triggered', {
      stageProgressDataLength: stageProgressData.length,
      orderProductsLength: orderProducts.length,
      routingStagesLength: Object.keys(routingStages).length,
      shouldInitialize: stageProgressData.length >= 0 && orderProducts.length > 0 && Object.keys(routingStages).length > 0
    });
    
    if (stageProgressData.length >= 0 && orderProducts.length > 0 && Object.keys(routingStages).length > 0) {
      initializeStageProgress();
    }
  }, [orderProducts, stageProgressData.length, routingStages]);

  return {
    stageProgressData,
    isLoading,
    isUpdating,
    updateStageProgress,
    getStageProgress,
    getOrderProductProgress,
    fetchStageProgress
  };
};