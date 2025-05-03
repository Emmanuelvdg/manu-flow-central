
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash, Pencil, Users, Machine } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RecipeRoutingStagesSectionProps } from "./form/RecipeFormTypes";
import type { Personnel, Machine as MachineType } from "./types/recipeMappingTypes";

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
  const getStageMachines = (stageId: string): MachineType[] => {
    return routingStages
      .find(stage => stage.id === stageId)?.machines || [];
  };

  // Handle selecting a stage to manage resources
  const handleSelectStage = (stageId: string) => {
    setActiveStageId(stageId);
    setActiveTab("details");
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
          <table className="w-full text-xs mb-1">
            <thead>
              <tr>
                <th className="text-left py-1 px-2">Stage</th>
                <th className="text-left py-1 px-2">Hours</th>
                <th className="text-left py-1 px-2">Personnel</th>
                <th className="text-left py-1 px-2">Machines</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {routingStages.map((stage) => (
                <tr key={stage.id} onClick={() => handleSelectStage(stage.id)} className="hover:bg-gray-100 cursor-pointer">
                  <td className="px-2 py-1">{stage.stage_name}</td>
                  <td className="px-2 py-1">{stage.hours}</td>
                  <td className="px-2 py-1">{(stage.personnel || []).length}</td>
                  <td className="px-2 py-1">{(stage.machines || []).length}</td>
                  <td className="px-2 py-1 flex gap-1">
                    <Button variant="ghost" size="icon" type="button" onClick={(e) => {
                      e.stopPropagation();
                      handleEditRoutingStage(stage);
                    }} disabled={disabled}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoutingStage(stage.id);
                    }} disabled={disabled}>
                      <Trash className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {activeStageId && !editingRoutingStage && !editingPersonnel && !editingMachine && (
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">
                  {routingStages.find(s => s.id === activeStageId)?.stage_name || "Stage Details"}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setActiveStageId(null)}>Close</Button>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="personnel">Personnel</TabsTrigger>
                  <TabsTrigger value="machines">Machines</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-2">
                  <div className="text-xs text-gray-600">
                    Hours: {routingStages.find(s => s.id === activeStageId)?.hours}
                  </div>
                </TabsContent>
                
                <TabsContent value="personnel" className="space-y-2">
                  <table className="w-full text-xs mb-1">
                    <thead>
                      <tr>
                        <th className="text-left py-1 px-2">Role</th>
                        <th className="text-left py-1 px-2">Hours</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {getStagePersonnel(activeStageId).map((person) => (
                        <tr key={person.id}>
                          <td className="px-2 py-1">{person.role}</td>
                          <td className="px-2 py-1">{person.hours}</td>
                          <td className="px-2 py-1 flex gap-1">
                            <Button variant="ghost" size="icon" type="button" onClick={() => {
                              handleEditPersonnel({...person, stageId: activeStageId});
                            }} disabled={disabled}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleDeletePersonnel(person.id, activeStageId)} disabled={disabled}>
                              <Trash className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="text-xs mt-1"
                    onClick={() => handleAddPersonnel(activeStageId)}
                    disabled={disabled}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Personnel
                  </Button>
                </TabsContent>
                
                <TabsContent value="machines" className="space-y-2">
                  <table className="w-full text-xs mb-1">
                    <thead>
                      <tr>
                        <th className="text-left py-1 px-2">Machine</th>
                        <th className="text-left py-1 px-2">Hours</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {getStageMachines(activeStageId).map((machine) => (
                        <tr key={machine.id}>
                          <td className="px-2 py-1">{machine.machine}</td>
                          <td className="px-2 py-1">{machine.hours}</td>
                          <td className="px-2 py-1 flex gap-1">
                            <Button variant="ghost" size="icon" type="button" onClick={() => {
                              handleEditMachine({...machine, stageId: activeStageId});
                            }} disabled={disabled}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleDeleteMachine(machine.id, activeStageId)} disabled={disabled}>
                              <Trash className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="text-xs mt-1"
                    onClick={() => handleAddMachine(activeStageId)}
                    disabled={disabled}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Machine
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {editingRoutingStage && (
            <div className="flex gap-2 items-end">
              <Select
                value={editingRoutingStage.stage_id || ""}
                onValueChange={handleStageIdChange}
                disabled={disabled}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {routingStagesList.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.stage_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Hours"
                type="number"
                min={0.1}
                step={0.1}
                className="w-16 text-xs"
                value={editingRoutingStage.hours ?? 1}
                onChange={e => setEditingRoutingStage({ ...editingRoutingStage, hours: Number(e.target.value) })}
                disabled={disabled}
              />
              <Button variant="outline" size="sm" type="button" onClick={handleSaveRoutingStage} disabled={disabled}>
                Save
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingRoutingStage(null)} disabled={disabled}>
                Cancel
              </Button>
            </div>
          )}
          
          {editingPersonnel && (
            <div className="flex gap-2 items-end border-t pt-2 mt-2">
              <Select
                value={editingPersonnel.role || ""}
                onValueChange={v => setEditingPersonnel({ ...editingPersonnel, role: v })}
                disabled={disabled}
              >
                <SelectTrigger className="w-48 text-xs">
                  <SelectValue placeholder="Personnel role" />
                </SelectTrigger>
                <SelectContent>
                  {personnelRoleList.map(role => (
                    <SelectItem key={role.id} value={role.role}>{role.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Hours"
                type="number"
                min={1}
                className="w-16 text-xs"
                value={editingPersonnel.hours ?? 1}
                onChange={e => setEditingPersonnel({ ...editingPersonnel, hours: Number(e.target.value) })}
                disabled={disabled}
              />
              <Button variant="outline" size="sm" type="button" onClick={handleSavePersonnel} disabled={disabled}>
                Save
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingPersonnel(null)} disabled={disabled}>
                Cancel
              </Button>
            </div>
          )}
          
          {editingMachine && (
            <div className="flex gap-2 items-end border-t pt-2 mt-2">
              <Input
                placeholder="Machine Name"
                value={editingMachine.machine ?? ""}
                className="text-xs"
                onChange={e => setEditingMachine({ ...editingMachine, machine: e.target.value })}
                autoFocus
                disabled={disabled}
              />
              <Input
                placeholder="Hours"
                type="number"
                min={1}
                className="w-16 text-xs"
                value={editingMachine.hours ?? 1}
                onChange={e => setEditingMachine({ ...editingMachine, hours: Number(e.target.value) })}
                disabled={disabled}
              />
              <Button variant="outline" size="sm" type="button" onClick={handleSaveMachine} disabled={disabled}>
                Save
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingMachine(null)} disabled={disabled}>
                Cancel
              </Button>
            </div>
          )}
          
          {!editingRoutingStage && !editingPersonnel && !editingMachine && !activeStageId && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="text-xs mt-1"
              onClick={handleAddRoutingStage}
              disabled={disabled}
            >
              <Plus className="w-3 h-3 mr-1" /> Add Routing Stage
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
