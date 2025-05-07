
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserGroupPermissions } from "./UserGroupPermissions";
import { UsersInGroupDialog } from "./UsersInGroupDialog";

interface UserGroupDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userGroup: {
    id: string;
    name: string;
    description: string | null;
  };
  onSuccess: () => void;
}

export function UserGroupDetailDialog({
  open,
  onOpenChange,
  userGroup,
  onSuccess,
}: UserGroupDetailDialogProps) {
  const { toast } = useToast();
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load member count
  useEffect(() => {
    async function loadMemberCount() {
      if (!open) return;
      
      setLoading(true);
      try {
        const { count, error } = await supabase
          .from('user_groups_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', userGroup.id);
        
        if (error) throw error;
        
        setMemberCount(count || 0);
      } catch (error) {
        console.error("Error loading member count:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadMemberCount();
  }, [open, userGroup.id]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{userGroup.name}</DialogTitle>
            {userGroup.description && (
              <p className="text-sm text-muted-foreground">{userGroup.description}</p>
            )}
          </DialogHeader>
          
          <Tabs defaultValue="permissions" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="members">
                Members {!loading && `(${memberCount})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="permissions" className="space-y-6">
              <UserGroupPermissions 
                userGroup={userGroup} 
                onSuccess={onSuccess} 
              />
            </TabsContent>
            
            <TabsContent value="members" className="space-y-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `This group has ${memberCount} members.`}
                </p>
                <Button 
                  onClick={() => setIsUsersDialogOpen(true)} 
                  className="w-fit"
                >
                  Manage Group Members
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <UsersInGroupDialog
        open={isUsersDialogOpen}
        onOpenChange={setIsUsersDialogOpen}
        groupId={userGroup.id}
        groupName={userGroup.name}
        onSuccess={onSuccess}
      />
    </>
  );
}
