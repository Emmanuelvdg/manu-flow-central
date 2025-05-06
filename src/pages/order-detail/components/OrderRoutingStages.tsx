
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Factory, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRoutingStages } from "./routing-stages/useRoutingStages";
import { LoadingState } from "./routing-stages/LoadingState";
import { RecipeStagesDisplay } from "./routing-stages/RecipeStagesDisplay";

interface OrderRoutingStagesProps {
  orderId: string;
  orderProducts: any[];
  refetch: () => Promise<void>;
}

export const OrderRoutingStages: React.FC<OrderRoutingStagesProps> = ({
  orderId,
  orderProducts,
  refetch
}) => {
  const { toast } = useToast();
  
  // Get all unique recipe IDs from order products
  const recipeIds = orderProducts
    .filter(product => product.recipe_id)
    .map(product => product.recipe_id);

  const uniqueRecipeIds = [...new Set(recipeIds)];
  
  // Use the custom hook for routing stages logic
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
  } = useRoutingStages(orderProducts, uniqueRecipeIds);

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

  const getProductNameForRecipe = (recipeId: string) => {
    const product = orderProducts.find(p => p.recipe_id === recipeId);
    return product?.product_name || product?.products?.name || "Unknown Product";
  };
  
  // If there are no products with recipes, show a message
  if (uniqueRecipeIds.length === 0 && !loading) {
    return (
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Production Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No production stages found. Products may need recipe mappings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Production Stages</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={loading}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <LoadingState 
          isLoading={loading}
          errorMessage={loadingErrorMessage}
          handleRefresh={handleRefresh}
        />
        
        {!loading && !loadingErrorMessage && Object.keys(routingStages).length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No production stages found for the recipes in this order.
          </p>
        ) : (
          !loading && !loadingErrorMessage && (
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList className="mb-4">
                <TabsTrigger value="stages">
                  <Clock className="h-4 w-4 mr-2" />
                  Stages
                </TabsTrigger>
                <TabsTrigger value="materials">
                  <div className="flex items-center">
                    Materials
                  </div>
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
              
              {Object.keys(routingStages).map(recipeId => {
                const stages = routingStages[recipeId];
                const orderProduct = orderProducts.find(p => p.recipe_id === recipeId);
                
                if (!stages || !orderProduct) return null;
                
                return (
                  <RecipeStagesDisplay
                    key={recipeId}
                    recipeId={recipeId}
                    stages={stages}
                    orderProduct={orderProduct}
                    expandedStages={expandedStages}
                    isUpdating={isUpdating}
                    stageProgress={stageProgress}
                    tabValue={tabValue}
                    productName={getProductNameForRecipe(recipeId)}
                    handleToggleStage={handleToggleStage}
                    handleProgressChange={handleProgressChange}
                    handleUpdateProgress={async (recipeId, stageId, orderProductId) => {
                      await handleUpdateProgress(recipeId, stageId, orderProductId);
                      await refetch();
                    }}
                  />
                );
              })}
            </Tabs>
          )
        )}
      </CardContent>
    </Card>
  );
};
