
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Factory } from "lucide-react";
import StageDetailsTab from "./StageDetailsTab";
import PersonnelTab from "./PersonnelTab";
import MachinesTab from "./MachinesTab";
import type { RoutingStage, Personnel, Machine } from "../types/recipeMappingTypes";

interface StageDetailPanelProps {
  activeStageId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setActiveStageId: (id: string | null) => void;
  routingStages: RoutingStage[];
  getTotalPersonnelHours: (stageId: string) => number;
  getTotalMachineHours: (stageId: string) => number;
  getStagePersonnel: (stageId: string) => Personnel[];
  getStageMachines: (stageId: string) => Machine[];
  handleEditPersonnel: (personnel: Personnel) => void;
  handleDeletePersonnel: (id: string, stageId: string) => void;
  handleAddPersonnel: (stageId: string) => void;
  handleEditMachine: (machine: Machine) => void;
  handleDeleteMachine: (id: string, stageId: string) => void;
  handleAddMachine: (stageId: string) => void;
  disabled?: boolean;
}

const StageDetailPanel: React.FC<StageDetailPanelProps> = ({
  activeStageId,
  activeTab,
  setActiveTab,
  setActiveStageId,
  routingStages,
  getTotalPersonnelHours,
  getTotalMachineHours,
  getStagePersonnel,
  getStageMachines,
  handleEditPersonnel,
  handleDeletePersonnel,
  handleAddPersonnel,
  handleEditMachine,
  handleDeleteMachine,
  handleAddMachine,
  disabled = false
}) => {
  const activeStage = routingStages.find(s => s.id === activeStageId);
  if (!activeStage) return null;

  const stagePersonnel = getStagePersonnel(activeStageId);
  const stageMachines = getStageMachines(activeStageId);

  return (
    <div className="border-t pt-2 mt-2">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">
          {activeStage.stage_name || "Stage Details"}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setActiveStageId(null)}>Close</Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="personnel">
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              Personnel
              <span className="ml-1 bg-gray-200 rounded-full px-1.5 py-0.5 text-xs">
                {stagePersonnel.length}
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="machines">
            <div className="flex items-center">
              <Factory size={14} className="mr-1" />
              Machines
              <span className="ml-1 bg-gray-200 rounded-full px-1.5 py-0.5 text-xs">
                {stageMachines.length}
              </span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-2">
          <StageDetailsTab 
            activeStageId={activeStageId}
            routingStages={routingStages}
            getTotalPersonnelHours={getTotalPersonnelHours}
            getTotalMachineHours={getTotalMachineHours}
          />
        </TabsContent>
        
        <TabsContent value="personnel" className="space-y-2">
          <PersonnelTab 
            stagePersonnel={stagePersonnel}
            activeStageId={activeStageId}
            handleEditPersonnel={handleEditPersonnel}
            handleDeletePersonnel={handleDeletePersonnel}
            handleAddPersonnel={handleAddPersonnel}
            disabled={disabled}
          />
        </TabsContent>
        
        <TabsContent value="machines" className="space-y-2">
          <MachinesTab 
            stageMachines={stageMachines}
            activeStageId={activeStageId}
            handleEditMachine={handleEditMachine}
            handleDeleteMachine={handleDeleteMachine}
            handleAddMachine={handleAddMachine}
            disabled={disabled}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StageDetailPanel;
