
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Users, Factory, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRoutingStages } from "./useRoutingStages";
import { LoadingState } from "./LoadingState";
import { StageCollapsible } from "./StageCollapsible";
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
    isUpdating,
    tabValue,
    setTabValue,
    routingStages,
    stageProgress,
    loading,
    loadingErrorMessage,
    handleToggleStage,
    handleProgressChange,
    handleUpdateProgress
  } = useRoutingStages([orderProduct], [recipeId]);

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

  // Check if all stages are at 100% progress
  const checkAndUpdateProductStatus = async () => {
    const stages = routingStages[recipeId] || [];
    
    if (stages.length === 0) return;
    
    // Check if all stages have 100% progress
    const allStagesComplete = stages.every(stage => {
      const materialsProgress = stageProgress[recipeId]?.[stage.id] || 0;
      return materialsProgress === 100;
    });
    
    // If all stages are complete and product is not already marked as completed, update it
    if (allStagesComplete && orderProduct.status !== 'completed') {
      try {
        const { error } = await supabase
          .from('order_products')
          .update({ 
            status: 'completed',
            materials_progress: 100,
            personnel_progress: 100,
            machines_progress: 100
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
    if (Object.keys(stageProgress).length > 0 && !loading) {
      checkAndUpdateProductStatus();
    }
  }, [stageProgress, loading]);

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
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <LoadingState 
        isLoading={loading}
        errorMessage={loadingErrorMessage}
        handleRefresh={handleRefresh}
      />
      
      {!loading && !loadingErrorMessage && Object.keys(routingStages).length === 0 ? (
        <p className="text-center text-muted-foreground py-2">
          No production stages found for this product.
        </p>
      ) : (
        !loading && !loadingErrorMessage && (
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="mb-4 grid grid-cols-4 w-full">
              <TabsTrigger value="stages">
                <Clock className="h-4 w-4 mr-2" />
                Stages
              </TabsTrigger>
              <TabsTrigger value="materials">
                Materials
              </TabsTrigger>
              <TabsTrigger value="personnel">
                <Users className="h-4 w-4 mr-2" />
                Personnel
              </TabsTrigger>
              <TabsTrigger value="machines">
                <Factory className="h-4 w-4 mr-2" />
                Machines
              </TabsTrigger>
            </TabsList>
            
            {/* Display stages for this specific recipe */}
            {Object.keys(routingStages).length > 0 && routingStages[recipeId] && (
              <div>
                {routingStages[recipeId].map(stage => (
                  <StageCollapsible
                    key={stage.id}
                    stage={stage}
                    recipeId={recipeId}
                    orderProduct={orderProduct}
                    expandedStages={expandedStages}
                    isUpdating={isUpdating}
                    stageProgress={stageProgress}
                    tabValue={tabValue}
                    handleToggleStage={handleToggleStage}
                    handleProgressChange={handleProgressChange}
                    handleUpdateProgress={async (recipeId, stageId, orderProductId) => {
                      await handleUpdateProgress(recipeId, stageId, orderProductId);
                      await checkAndUpdateProductStatus();
                      await refetch();
                    }}
                  />
                ))}
              </div>
            )}
          </Tabs>
        )
      )}
    </div>
  );
};
