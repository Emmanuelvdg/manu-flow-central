
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RoutingTable, RoutingStage } from "./RoutingTable";
import { RoutingStageDialog } from "./RoutingStageDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const RoutingSection: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<RoutingStage | undefined>(undefined);
  
  const handleAddStage = () => {
    setSelectedStage(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEditStage = (stage: RoutingStage) => {
    setSelectedStage(stage);
    setIsDialogOpen(true);
  };
  
  const handleSaveStage = async (values: { stage_name: string; description: string }) => {
    try {
      if (selectedStage?.id) {
        // Update existing stage
        const { error } = await supabase
          .from('routing_stages')
          .update({
            stage_name: values.stage_name,
            description: values.description,
          })
          .eq('id', selectedStage.id);
          
        if (error) throw error;
        
        toast({
          title: "Stage Updated",
          description: "Routing stage was updated successfully.",
        });
      } else {
        // Create new stage
        const { error } = await supabase
          .from('routing_stages')
          .insert({
            stage_name: values.stage_name,
            description: values.description,
          });
          
        if (error) throw error;
        
        toast({
          title: "Stage Created",
          description: "New routing stage was created successfully.",
        });
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["routing_stages"] });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving routing stage:", error);
      toast({
        title: "Error",
        description: `Failed to save routing stage: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteStage = async (stageId: string) => {
    if (!confirm("Are you sure you want to delete this routing stage?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('routing_stages')
        .delete()
        .eq('id', stageId);
        
      if (error) throw error;
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["routing_stages"] });
      
      toast({
        title: "Stage Deleted",
        description: "Routing stage was deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting routing stage:", error);
      toast({
        title: "Error",
        description: `Failed to delete routing stage: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="mb-8">
      <div className="p-6 flex justify-between items-center border-b">
        <h3 className="text-lg font-semibold">Routing Stages</h3>
        <Button onClick={handleAddStage}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stage
        </Button>
      </div>
      
      <CardContent className="p-6">
        <RoutingTable 
          onEditStage={handleEditStage}
          onDeleteStage={handleDeleteStage}
        />
      </CardContent>
      
      <RoutingStageDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveStage}
        initialValues={selectedStage}
      />
    </Card>
  );
};
