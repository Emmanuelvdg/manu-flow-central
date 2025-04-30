
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface RoutingStage {
  id: string;
  stage_name: string;
  description: string | null;
}

const fetchRoutingStages = async (): Promise<RoutingStage[]> => {
  const { data, error } = await supabase
    .from('routing_stages')
    .select('*')
    .order('stage_name');
    
  if (error) throw error;
  return data || [];
};

interface RoutingTableProps {
  onEditStage: (stage: RoutingStage) => void;
  onDeleteStage: (stageId: string) => void;
}

export const RoutingTable: React.FC<RoutingTableProps> = ({ 
  onEditStage, 
  onDeleteStage 
}) => {
  const { data: routingStages = [], isLoading, error } = useQuery({
    queryKey: ["routing_stages"],
    queryFn: fetchRoutingStages,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stage Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={3}>
                Loading routing stages...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell className="h-24 text-center text-destructive" colSpan={3}>
                Could not load routing stages. {String(error)}
              </TableCell>
            </TableRow>
          ) : routingStages.length === 0 ? (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={3}>
                No routing stages found.
              </TableCell>
            </TableRow>
          ) : (
            routingStages.map((stage) => (
              <TableRow key={stage.id}>
                <TableCell>{stage.stage_name}</TableCell>
                <TableCell>{stage.description || '-'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditStage(stage)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDeleteStage(stage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
