
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { RecipeRoutingStagesSectionProps } from "./form/RecipeFormTypes";
import type { Personnel, Machine } from "./types/recipeMappingTypes";
import StageList from "./routing-stages/StageList";
import StageDetailPanel from "./routing-stages/StageDetailPanel";
import StageEditor from "./routing-stages/StageEditor";
import PersonnelEditor from "./routing-stages/PersonnelEditor";
import MachineEditor from "./routing-stages/MachineEditor";
import AddStageButton from "./routing-stages/AddStageButton";

export const RecipeRoutingStagesSection: React.FC<RecipeRoutingStagesSectionProps> = ({
  routingStages,
  routingStagesList,
  showRoutingStages,
  setShowRoutingStages,
  editingRoutingStage,
  setEditingRoutingStage,
  handleAddRoutingStage,
  handleEditRoutingStage,
  handleSaveRoutingStage,
  handleDeleteRoutingStage,
  // Personnel management
  personnelRoleList,
  handleAddPersonnel,
  handleEditPersonnel,
  handleSavePersonnel,
  handleDeletePersonnel,
  editingPersonnel,
  setEditingPersonnel,
  // Machine management
  handleAddMachine,
  handleEditMachine,
  handleSaveMachine,
  handleDeleteMachine,
  editingMachine,
  setEditingMachine,
  disabled = false
}) => {
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");

  // Handle stage ID change
  const handleStageIdChange = (stageId: string) => {
    if (!editingRoutingStage) return;
    
    const selectedStage = routingStagesList.find(stage => stage.id === stageId);
    if (selectedStage) {
      setEditingRoutingStage({ 
        ...editingRoutingStage, 
        stage_id: stageId,
        stage_name: selectedStage.stage_name 
      });
    }
  };

  // Get personnel for a specific stage
  const getStagePersonnel = (stageId: string): Personnel[] => {
    return routingStages
      .find(stage => stage.id === stageId)?.personnel || [];
  };

  // Get machines for a specific stage
  const getStageMachines = (stageId: string): Machine[] => {
    return routingStages
      .find(stage => stage.id === stageId)?.machines || [];
  };

  // Handle selecting a stage to manage resources
  const handleSelectStage = (stageId: string) => {
    setActiveStageId(stageId);
    setActiveTab("details");
  };

  // Calculate total hours for personnel in a stage
  const getTotalPersonnelHours = (stageId: string): number => {
    const personnel = getStagePersonnel(stageId);
    return personnel.reduce((sum, p) => sum + (p.hours || 0), 0);
  };

  // Calculate total hours for machines in a stage
  const getTotalMachineHours = (stageId: string): number => {
    const machines = getStageMachines(stageId);
    return machines.reduce((sum, m) => sum + (m.hours || 0), 0);
  };

  return (
    <div>
      <button
        type="button"
        className="flex items-center w-full mb-2"
        onClick={() => setShowRoutingStages(!showRoutingStages)}
        disabled={disabled}
      >
        <span className="font-semibold text-purple-700 pr-2">Routing Stages ({routingStages.length})</span>
        <span>{showRoutingStages ? <Minus size={16} /> : <Plus size={16} />}</span>
      </button>
      {showRoutingStages && (
        <div className="mb-4 border rounded-lg bg-gray-50 p-2 space-y-2">
          <StageList 
            routingStages={routingStages}
            handleEditRoutingStage={handleEditRoutingStage}
            handleDeleteRoutingStage={handleDeleteRoutingStage}
            handleSelectStage={handleSelectStage}
            getTotalPersonnelHours={getTotalPersonnelHours}
            getTotalMachineHours={getTotalMachineHours}
            disabled={disabled}
          />
          
          {activeStageId && !editingRoutingStage && !editingPersonnel && !editingMachine && (
            <StageDetailPanel 
              activeStageId={activeStageId}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setActiveStageId={setActiveStageId}
              routingStages={routingStages}
              getTotalPersonnelHours={getTotalPersonnelHours}
              getTotalMachineHours={getTotalMachineHours}
              getStagePersonnel={getStagePersonnel}
              getStageMachines={getStageMachines}
              handleEditPersonnel={handleEditPersonnel}
              handleDeletePersonnel={handleDeletePersonnel}
              handleAddPersonnel={handleAddPersonnel}
              handleEditMachine={handleEditMachine}
              handleDeleteMachine={handleDeleteMachine}
              handleAddMachine={handleAddMachine}
              disabled={disabled}
            />
          )}
          
          {editingRoutingStage && (
            <StageEditor 
              editingRoutingStage={editingRoutingStage}
              routingStagesList={routingStagesList}
              handleStageIdChange={handleStageIdChange}
              setEditingRoutingStage={setEditingRoutingStage}
              handleSaveRoutingStage={handleSaveRoutingStage}
              disabled={disabled}
            />
          )}
          
          {editingPersonnel && (
            <PersonnelEditor 
              editingPersonnel={editingPersonnel}
              personnelRoleList={personnelRoleList}
              setEditingPersonnel={setEditingPersonnel}
              handleSavePersonnel={handleSavePersonnel}
              disabled={disabled}
            />
          )}
          
          {editingMachine && (
            <MachineEditor 
              editingMachine={editingMachine}
              setEditingMachine={setEditingMachine}
              handleSaveMachine={handleSaveMachine}
              disabled={disabled}
            />
          )}
          
          {!editingRoutingStage && !editingPersonnel && !editingMachine && !activeStageId && (
            <AddStageButton 
              handleAddRoutingStage={handleAddRoutingStage}
              disabled={disabled}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeRoutingStagesSection;
