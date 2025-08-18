
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Users, Factory, RefreshCcw, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRoutingStages } from "./useRoutingStages";
import { useUnitProgress } from "./hooks/useUnitProgress";
import { LoadingState } from "./LoadingState";
import { StageProgressTable } from "./StageProgressTable";
import { UnitProgressInput } from "./UnitProgressInput";
import { supabase } from "@/integrations/supabase/client";

interface ProductRoutingStagesProps {
  recipeId: string;
  orderProduct: any;
  refetch: () => Promise<void>;
}

export const ProductRoutingStages: React.FC<ProductRoutingStagesProps> = ({
  recipeId,
  orderProduct,
  refetch
}) => {
  const { toast } = useToast();
  
  // Use the custom hook for routing stages logic with a single recipe ID
  const {
    expandedStages,
    tabValue,
    setTabValue,
    routingStages,
    loading,
    loadingErrorMessage,
    handleToggleStage
  } = useRoutingStages([orderProduct], [recipeId]);

  // Use unit-based progress tracking
  const {
    stageProgressData,
    isLoading: progressLoading,
    isUpdating,
    updateStageProgress,
    getStageProgress,
    getOrderProductProgress
  } = useUnitProgress([orderProduct], routingStages, refetch);

  // Function to refresh data
  const handleRefresh = async () => {
    toast({
      title: "Refreshing data...",
      description: "Production stages are being refreshed",
    });
    await refetch();
    toast({
      title: "Data refreshed",
      description: "Production stages have been refreshed",
    });
  };

  // Check if all stages are at 100% progress based on unit completion
  const checkAndUpdateProductStatus = async () => {
    const productProgress = stageProgressData.filter(p => p.order_product_id === orderProduct.id);
    
    if (productProgress.length === 0) return;
    
    // Check if all stages have all units completed
    const allStagesComplete = productProgress.every(stage => 
      stage.completed_units === stage.total_units
    );
    
    // If all stages are complete and product is not already marked as completed, update it
    if (allStagesComplete && orderProduct.status !== 'completed') {
      try {
        const { error } = await supabase
          .from('order_products')
          .update({ 
            status: 'completed'
          })
          .eq('id', orderProduct.id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Product status updated",
          description: "Product marked as completed",
        });
        
        await refetch();
      } catch (err) {
        console.error("Error updating product status:", err);
        toast({
          title: "Error",
          description: "Failed to update product status",
          variant: "destructive",
        });
      }
    }
  };
  
  // Check status after any progress update
  React.useEffect(() => {
    if (stageProgressData.length > 0 && !loading && !progressLoading) {
      checkAndUpdateProductStatus();
    }
  }, [stageProgressData, loading, progressLoading]);

  // If there are no products with recipes, show a message
  if (!recipeId && !loading) {
    return (
      <div className="mt-4 border-t pt-4">
        <p className="text-muted-foreground text-center py-2">
          No production stages found for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium">Production Stages</h3>
        <div className="flex items-center gap-2">
          {getOrderProductProgress(orderProduct.id).total > 0 && (
            <span className="text-sm text-muted-foreground">
              {getOrderProductProgress(orderProduct.id).completed}/{getOrderProductProgress(orderProduct.id).total} units completed
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={loading || progressLoading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <LoadingState 
        isLoading={loading || progressLoading}
        errorMessage={loadingErrorMessage}
        handleRefresh={handleRefresh}
      />
      
      {!loading && !progressLoading && !loadingErrorMessage && Object.keys(routingStages).length === 0 ? (
        <p className="text-center text-muted-foreground py-2">
          No production stages found for this product.
        </p>
      ) : (
        !loading && !progressLoading && !loadingErrorMessage && (
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="mb-4 grid grid-cols-2 w-full">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Progress Overview
              </TabsTrigger>
              <TabsTrigger value="details">
                <Clock className="h-4 w-4 mr-2" />
                Stage Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <StageProgressTable 
                stageProgressData={stageProgressData.filter(p => p.order_product_id === orderProduct.id)}
                orderProducts={[orderProduct]}
              />
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-4">
                {/* Display stages for this specific recipe */}
                {Object.keys(routingStages).length > 0 && routingStages[recipeId] && 
                  routingStages[recipeId].map(stage => {
                    // Use consistent stage key - prefer stage_id if available, fallback to id
                    const stageKey = stage.stage_id || stage.id;
                    const stageProgress = getStageProgress(orderProduct.id, stageKey);
                    if (!stageProgress) return null;

                    return (
                      <UnitProgressInput
                        key={stageProgress.id}
                        stageProgress={stageProgress}
                        isUpdating={isUpdating[stageProgress.id] || false}
                        onUpdateProgress={async (stageProgressId, updates) => {
                          await updateStageProgress(stageProgressId, updates);
                          await checkAndUpdateProductStatus();
                        }}
                      />
                    );
                  })
                }
              </div>
            </TabsContent>
          </Tabs>
        )
      )}
    </div>
  );
};
