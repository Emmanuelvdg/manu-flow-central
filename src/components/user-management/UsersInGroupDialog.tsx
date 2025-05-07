
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UsersInGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  onSuccess: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  isMember: boolean;
}

export function UsersInGroupDialog({
  open,
  onOpenChange,
  groupId,
  groupName,
  onSuccess,
}: UsersInGroupDialogProps) {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load users and their membership status
  useEffect(() => {
    async function loadUsers() {
      if (!open) return;
      
      setLoading(true);
      try {
        // Get all user profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('id, name, email');
        
        if (profilesError) throw profilesError;
        
        // Get all memberships for the current group
        const { data: memberships, error: membershipsError } = await supabase
          .from('user_groups_members')
          .select('user_id')
          .eq('group_id', groupId);
        
        if (membershipsError) throw membershipsError;
        
        // Convert to a Set for easy lookup
        const memberIds = new Set(memberships.map(m => m.user_id));
        
        // Combine the data
        const formattedUsers = profiles.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          isMember: memberIds.has(user.id)
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
  }, [open, groupId, toast]);

  // Toggle user membership
  const toggleMembership = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isMember: !user.isMember }
        : user
    ));
  };

  // Save changes
  const saveChanges = async () => {
    setSaving(true);
    try {
      // Delete all existing memberships
      await supabase
        .from('user_groups_members')
        .delete()
        .eq('group_id', groupId);
      
      // Get users who should be members
      const membersToAdd = users
        .filter(user => user.isMember)
        .map(user => ({
          user_id: user.id,
          group_id: groupId
        }));
      
      // If there are members to add, insert them
      if (membersToAdd.length > 0) {
        const { error } = await supabase
          .from('user_groups_members')
          .insert(membersToAdd);
        
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Group members updated successfully",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving group members:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update group members",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Manage Users in {groupName}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">Loading users...</div>
        ) : (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No users found.</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2 py-2 border-b">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={user.isMember}
                      onCheckedChange={() => toggleMembership(user.id)}
                    />
                    <div className="grid gap-1.5">
                      <label
                        htmlFor={`user-${user.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {user.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveChanges} disabled={saving || loading}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
