
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UserGroupDialog } from './UserGroupDialog';
import { UsersInGroupDialog } from './UsersInGroupDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserGroupActionsProps {
  userGroupId: string;
  userGroupName: string;
  onSuccess: () => void;
}

export const UserGroupActions: React.FC<UserGroupActionsProps> = ({
  userGroupId,
  userGroupName,
  onSuccess
}) => {
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [usersDialogOpen, setUsersDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userGroup, setUserGroup] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select('*')
        .eq('id', userGroupId)
        .single();

      if (error) throw error;
      
      setUserGroup(data);
      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching user group:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user group details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageUsers = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUsersDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      // First delete all associated access matrix entries
      const { error: matrixError } = await supabase
        .from('access_matrix')
        .delete()
        .eq('group_id', userGroupId);
      
      if (matrixError) throw matrixError;
      
      // Then delete all user memberships
      const { error: membershipError } = await supabase
        .from('user_groups_members')
        .delete()
        .eq('group_id', userGroupId);
      
      if (membershipError) throw membershipError;
      
      // Finally delete the group itself
      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('id', userGroupId);
      
      if (error) throw error;

      toast({
        title: "User Group Deleted",
        description: `${userGroupName} has been deleted.`,
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error deleting user group:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user group",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleManageUsers} disabled={loading}>
          <Users className="mr-2 h-4 w-4" />
          Users
        </Button>
        <Button variant="outline" size="sm" onClick={handleEdit} disabled={loading}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {userGroup && (
        <UserGroupDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          userGroup={userGroup}
          onSuccess={onSuccess}
        />
      )}
      
      <UsersInGroupDialog
        open={usersDialogOpen}
        onOpenChange={setUsersDialogOpen}
        groupId={userGroupId}
        groupName={userGroupName}
        onSuccess={onSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{userGroupName}" group and remove all associated permissions and memberships. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
