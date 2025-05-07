
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Resource {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
}

interface Permission {
  id: string;
  name: string;
  display_name: string;
}

interface UserGroupPermissionsProps {
  userGroup: {
    id: string;
    name: string;
  };
  onSuccess: () => void;
}

export const UserGroupPermissions: React.FC<UserGroupPermissionsProps> = ({
  userGroup,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [accessMatrix, setAccessMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load resources, permissions and the current access matrix
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*')
          .order('display_name');
        
        if (resourcesError) throw resourcesError;
        
        // Load permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('*')
          .order('name');
        
        if (permissionsError) throw permissionsError;
        
        // Load existing access matrix entries
        const { data: matrixData, error: matrixError } = await supabase
          .from('access_matrix')
          .select('resource_id, permission_id')
          .eq('group_id', userGroup.id);
        
        if (matrixError) throw matrixError;
        
        // Initialize accessMatrix
        const matrix: Record<string, Record<string, boolean>> = {};
        resourcesData.forEach((resource: Resource) => {
          matrix[resource.id] = {};
          permissionsData.forEach((permission: Permission) => {
            matrix[resource.id][permission.id] = false;
          });
        });
        
        // Fill in existing permissions
        matrixData.forEach((entry: any) => {
          if (matrix[entry.resource_id]) {
            matrix[entry.resource_id][entry.permission_id] = true;
          }
        });
        
        setResources(resourcesData);
        setPermissions(permissionsData);
        setAccessMatrix(matrix);
      } catch (error) {
        console.error("Error loading permissions data:", error);
        toast({
          title: "Error",
          description: "Failed to load permissions data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [userGroup.id, toast]);

  // Toggle a permission checkbox
  const togglePermission = (resourceId: string, permissionId: string) => {
    setAccessMatrix(prev => ({
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [permissionId]: !prev[resourceId][permissionId]
      }
    }));
  };

  // Save all changes
  const saveChanges = async () => {
    setSaving(true);
    try {
      // First delete all existing permissions for this group
      await supabase
        .from('access_matrix')
        .delete()
        .eq('group_id', userGroup.id);
      
      // Prepare new permissions
      const newPermissions = [];
      
      for (const resourceId in accessMatrix) {
        for (const permissionId in accessMatrix[resourceId]) {
          if (accessMatrix[resourceId][permissionId]) {
            newPermissions.push({
              group_id: userGroup.id,
              resource_id: resourceId,
              permission_id: permissionId
            });
          }
        }
      }
      
      // Insert new permissions if there are any
      if (newPermissions.length > 0) {
        const { error } = await supabase
          .from('access_matrix')
          .insert(newPermissions);
        
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error saving permissions:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update permissions",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading permissions...</div>;
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 border border-gray-200 rounded-md">
        <ScrollArea className="h-[400px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-background">
              <tr>
                <th className="text-left p-2">Resource</th>
                {permissions.map(permission => (
                  <th key={permission.id} className="text-center p-2">
                    {permission.display_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id} className="border-t">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{resource.display_name}</div>
                      {resource.description && (
                        <div className="text-xs text-muted-foreground">
                          {resource.description}
                        </div>
                      )}
                    </div>
                  </td>
                  {permissions.map(permission => (
                    <td key={`${resource.id}-${permission.id}`} className="text-center p-2">
                      <Checkbox
                        checked={accessMatrix[resource.id]?.[permission.id] || false}
                        onCheckedChange={() => togglePermission(resource.id, permission.id)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={saveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save Permissions"}
        </Button>
      </div>
    </div>
  );
};
