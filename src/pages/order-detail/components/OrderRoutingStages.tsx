
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Clock, Users, Factory } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RoutingStage {
  id: string;
  stage_name: string;
  hours: number;
  personnel?: {
    id: string;
    role: string;
    hours: number;
  }[];
  machines?: {
    id: string;
    machine: string;
    hours: number;
  }[];
}

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
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [tabValue, setTabValue] = useState("stages");

  // Get all unique recipe IDs from order products
  const recipeIds = orderProducts
    .filter(product => product.recipe_id)
    .map(product => product.recipe_id);

  const uniqueRecipeIds = [...new Set(recipeIds)];
  
  // Get all stages from all recipes
  const [routingStages, setRoutingStages] = useState<Record<string, RoutingStage[]>>({});
  const [stageProgress, setStageProgress] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchRoutingStages = async () => {
      setLoading(true);
      
      try {
        // Skip if no recipes
        if (uniqueRecipeIds.length === 0) {
          setLoading(false);
          return;
        }
        
        // Fetch recipes with routing stages
        const { data: recipes, error } = await supabase
          .from('recipes')
          .select('id, name, routing_stages')
          .in('id', uniqueRecipeIds);
          
        if (error) throw error;
        
        // Transform data
        const stagesMap: Record<string, RoutingStage[]> = {};
        const progressMap: Record<string, Record<string, number>> = {};
        
        recipes.forEach(recipe => {
          if (recipe.routing_stages && Array.isArray(recipe.routing_stages)) {
            stagesMap[recipe.id] = recipe.routing_stages;
            
            // Initialize progress for each stage (default to 0)
            progressMap[recipe.id] = {};
            recipe.routing_stages.forEach(stage => {
              progressMap[recipe.id][stage.id] = 0;
            });
          }
        });
        
        setRoutingStages(stagesMap);
        setStageProgress(progressMap);
      } catch (err) {
        console.error("Error fetching routing stages:", err);
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
      
      // Refresh the data
      await refetch();
      
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

  // Progress input with increment/decrement buttons
  const ProgressInput = ({ 
    recipeId, 
    stageId, 
    orderProductId,
    progressType 
  }: { 
    recipeId: string, 
    stageId: string, 
    orderProductId: string,
    progressType: 'materials' | 'personnel' | 'machines' 
  }) => {
    const progress = stageProgress[recipeId]?.[stageId] || 0;
    const isUpdatingThis = isUpdating[`${recipeId}-${stageId}`] || false;
    
    const incrementProgress = () => {
      const newValue = Math.min(progress + 5, 100);
      handleProgressChange(recipeId, stageId, progressType, newValue);
    };
    
    const decrementProgress = () => {
      const newValue = Math.max(progress - 5, 0);
      handleProgressChange(recipeId, stageId, progressType, newValue);
    };
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex flex-col space-y-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 py-0 h-6" 
            onClick={incrementProgress}
            disabled={progress === 100 || isUpdatingThis}
          >
            +
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 py-0 h-6" 
            onClick={decrementProgress}
            disabled={progress === 0 || isUpdatingThis}
          >
            -
          </Button>
        </div>
        <Button 
          size="sm" 
          onClick={() => handleUpdateProgress(recipeId, stageId, orderProductId)}
          disabled={isUpdatingThis}
          className="h-full"
        >
          {isUpdatingThis ? "Saving..." : "Save"}
        </Button>
      </div>
    );
  };

  const getProductNameForRecipe = (recipeId: string) => {
    const product = orderProducts.find(p => p.recipe_id === recipeId);
    return product?.product_name || "Unknown Product";
  };
  
  // If there are no products with recipes, show a message
  if (uniqueRecipeIds.length === 0 && !loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
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
      <CardHeader>
        <CardTitle>Production Stages</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading production stages...</p>
          </div>
        ) : (
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
                <div key={recipeId} className="mb-6 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">{getProductNameForRecipe(recipeId)}</h3>
                  
                  {stages.map(stage => (
                    <Collapsible 
                      key={stage.id} 
                      open={expandedStages[`${recipeId}-${stage.id}`]}
                      className="border rounded-md mt-2 overflow-hidden"
                    >
                      <CollapsibleTrigger 
                        onClick={() => handleToggleStage(recipeId, stage.id)}
                        className="w-full flex justify-between items-center p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium flex items-center">
                          {stage.stage_name}
                          <span className="ml-2 text-sm text-gray-500">({stage.hours} hrs)</span>
                        </div>
                        {expandedStages[`${recipeId}-${stage.id}`] ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-3 border-t bg-gray-50">
                        <TabsContent value="stages" className="mt-0">
                          <div className="mb-4">
                            <ProgressInput 
                              recipeId={recipeId} 
                              stageId={stage.id} 
                              orderProductId={orderProduct.id}
                              progressType="materials"
                            />
                          </div>
                          <div className="text-sm">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <strong>Materials:</strong> {orderProduct.materials_progress || 0}%
                              </div>
                              <div>
                                <strong>Personnel:</strong> {orderProduct.personnel_progress || 0}%
                              </div>
                              <div>
                                <strong>Machines:</strong> {orderProduct.machines_progress || 0}%
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="materials" className="mt-0">
                          <ProgressInput 
                            recipeId={recipeId} 
                            stageId={stage.id} 
                            orderProductId={orderProduct.id}
                            progressType="materials"
                          />
                          <p className="text-sm mt-2">Current progress: {orderProduct.materials_progress || 0}%</p>
                        </TabsContent>
                        
                        <TabsContent value="personnel" className="mt-0">
                          <ProgressInput 
                            recipeId={recipeId} 
                            stageId={stage.id} 
                            orderProductId={orderProduct.id}
                            progressType="personnel"
                          />
                          <div className="mt-2">
                            {stage.personnel && stage.personnel.length > 0 ? (
                              <div className="text-sm">
                                <p className="font-medium">Personnel required:</p>
                                <ul className="list-disc pl-5 mt-1">
                                  {stage.personnel.map(person => (
                                    <li key={person.id}>
                                      {person.role} ({person.hours} hrs)
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No personnel assigned to this stage</p>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="machines" className="mt-0">
                          <ProgressInput 
                            recipeId={recipeId} 
                            stageId={stage.id} 
                            orderProductId={orderProduct.id}
                            progressType="machines"
                          />
                          <div className="mt-2">
                            {stage.machines && stage.machines.length > 0 ? (
                              <div className="text-sm">
                                <p className="font-medium">Machines required:</p>
                                <ul className="list-disc pl-5 mt-1">
                                  {stage.machines.map(machine => (
                                    <li key={machine.id}>
                                      {machine.machine} ({machine.hours} hrs)
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No machines assigned to this stage</p>
                            )}
                          </div>
                        </TabsContent>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              );
            })}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
