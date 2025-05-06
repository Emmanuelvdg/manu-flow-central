
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ProgressInput } from "./ProgressInput";
import { StagePersonnelDisplay } from "./StagePersonnelDisplay";
import { StageMachinesDisplay } from "./StageMachinesDisplay";
import { RoutingStage } from "@/components/recipe/types/recipeMappingTypes";

interface StageCollapsibleProps {
  stage: RoutingStage;
  recipeId: string;
  orderProduct: any;
  expandedStages: Record<string, boolean>;
  isUpdating: Record<string, boolean>;
  stageProgress: Record<string, Record<string, number>>;
  tabValue: string;
  handleToggleStage: (recipeId: string, stageId: string) => void;
  handleProgressChange: (recipeId: string, stageId: string, progressType: 'materials' | 'personnel' | 'machines', value: number) => void;
  handleUpdateProgress: (recipeId: string, stageId: string, orderProductId: string) => Promise<void>;
}

export const StageCollapsible: React.FC<StageCollapsibleProps> = ({
  stage,
  recipeId,
  orderProduct,
  expandedStages,
  isUpdating,
  stageProgress,
  tabValue,
  handleToggleStage,
  handleProgressChange,
  handleUpdateProgress
}) => {
  const progress = stageProgress[recipeId]?.[stage.id] || 0;
  
  return (
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
              progress={progress}
              progressType="materials"
              isUpdating={isUpdating[`${recipeId}-${stage.id}`] || false}
              onProgressChange={handleProgressChange}
              onUpdateProgress={handleUpdateProgress}
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
            progress={progress}
            progressType="materials"
            isUpdating={isUpdating[`${recipeId}-${stage.id}`] || false}
            onProgressChange={handleProgressChange}
            onUpdateProgress={handleUpdateProgress}
          />
          <p className="text-sm mt-2">Current progress: {orderProduct.materials_progress || 0}%</p>
        </TabsContent>
        
        <TabsContent value="personnel" className="mt-0">
          <ProgressInput 
            recipeId={recipeId} 
            stageId={stage.id} 
            orderProductId={orderProduct.id}
            progress={progress}
            progressType="personnel"
            isUpdating={isUpdating[`${recipeId}-${stage.id}`] || false}
            onProgressChange={handleProgressChange}
            onUpdateProgress={handleUpdateProgress}
          />
          <StagePersonnelDisplay personnel={stage.personnel} />
        </TabsContent>
        
        <TabsContent value="machines" className="mt-0">
          <ProgressInput 
            recipeId={recipeId} 
            stageId={stage.id} 
            orderProductId={orderProduct.id}
            progress={progress}
            progressType="machines"
            isUpdating={isUpdating[`${recipeId}-${stage.id}`] || false}
            onProgressChange={handleProgressChange}
            onUpdateProgress={handleUpdateProgress}
          />
          <StageMachinesDisplay machines={stage.machines} />
        </TabsContent>
      </CollapsibleContent>
    </Collapsible>
  );
};
