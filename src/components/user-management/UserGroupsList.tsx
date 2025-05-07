
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/DataTable";
import { UserGroupDialog } from "./UserGroupDialog";
import { UserGroupColumns } from "./columns/userGroupColumns";
import { UserGroupDetailDialog } from "./UserGroupDetailDialog";

interface UserGroup {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const UserGroupsList = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: userGroups = [], isLoading, refetch } = useQuery({
    queryKey: ['user-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_groups')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching user groups:', error);
        toast({
          title: "Error",
          description: "Failed to load user groups",
          variant: "destructive",
        });
        throw error;
      }
      
      return data as UserGroup[];
    }
  });

  const handleCreateGroup = () => {
    setIsCreateDialogOpen(true);
  };

  const handleRowClick = (row: UserGroup) => {
    setSelectedGroup(row);
    setIsDetailDialogOpen(true);
  };

  const columns = UserGroupColumns({ refetch });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Groups</CardTitle>
          <Button onClick={handleCreateGroup} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Group
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading user groups...</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={userGroups} 
              onRowClick={handleRowClick}
            />
          )}
        </CardContent>
      </Card>

      <UserGroupDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => refetch()}
      />

      {selectedGroup && (
        <UserGroupDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          userGroup={selectedGroup}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
};
