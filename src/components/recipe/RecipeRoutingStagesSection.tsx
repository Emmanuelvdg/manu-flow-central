
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecipeRoutingStagesSectionProps {
  routingStages: any[];
  routingStagesList: any[];
  showRoutingStages: boolean;
  setShowRoutingStages: (show: boolean) => void;
  editingRoutingStage: any | null;
  setEditingRoutingStage: (r: any | null) => void;
  handleAddRoutingStage: () => void;
  handleEditRoutingStage: (r: any) => void;
  handleSaveRoutingStage: () => void;
  handleDeleteRoutingStage: (id: string) => void;
  disabled?: boolean;
}

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
  disabled
}) => {
  // Modal State
  const isEditing = editingRoutingStage && !editingRoutingStage.isNew;

  const handleSave = () => {
    handleSaveRoutingStage();
    setShowRoutingStages(false);
  };

  const handleClose = () => {
    setEditingRoutingStage(null);
    setShowRoutingStages(false);
  };

  const updateRoutingStage = (key: string, value: any) => {
    if (!editingRoutingStage) return;
    setEditingRoutingStage({ ...editingRoutingStage, [key]: value });
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Routing Stages</CardTitle>
        <Button
          size="sm"
          variant="outline" 
          onClick={handleAddRoutingStage} 
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Routing Stage
        </Button>
      </CardHeader>
      <CardContent>
        {routingStages.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No routing stages added. Click "Add Routing Stage" to add one.
          </div>
        ) : (
          <div className="space-y-2">
            {routingStages.map((stage) => (
              <div key={stage.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{stage.stage_name}</div>
                  <div className="text-sm text-gray-500">{stage.hours} hours</div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditRoutingStage(stage)} disabled={disabled}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteRoutingStage(stage.id)} disabled={disabled}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Routing Stage Dialog */}
      <Dialog open={showRoutingStages} onOpenChange={setShowRoutingStages}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit' : 'Add'} Routing Stage</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage_id" className="text-right">
                Stage
              </Label>
              <Select
                value={editingRoutingStage?.stage_id || ""}
                onValueChange={(value) => updateRoutingStage('stage_id', value)}
                disabled={disabled}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a routing stage" />
                </SelectTrigger>
                <SelectContent>
                  {routingStagesList.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.stage_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hours" className="text-right">
                Hours
              </Label>
              <Input
                id="hours"
                type="number"
                min="0.1"
                step="0.1"
                className="col-span-3"
                value={editingRoutingStage?.hours || 1}
                onChange={(e) => updateRoutingStage('hours', parseFloat(e.target.value))}
                disabled={disabled}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={!editingRoutingStage?.stage_id || disabled}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
