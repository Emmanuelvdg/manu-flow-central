
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface UserGroup {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  name: string;
  display_name: string;
}

interface Permission {
  id: string;
  name: string;
  display_name: string;
}

interface AccessMatrixEntry {
  group_id: string;
  resource_id: string;
  permission_id: string;
}

export const AccessMatrix = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [accessMatrixEntries, setAccessMatrixEntries] = useState<AccessMatrixEntry[]>([]);

  // Load all data needed for the matrix
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load user groups
        const { data: groupsData, error: groupsError } = await supabase
          .from('user_groups')
          .select('id, name')
          .order('name');
        
        if (groupsError) throw groupsError;
        
        // Load resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('id, name, display_name')
          .order('display_name');
        
        if (resourcesError) throw resourcesError;
        
        // Load permissions
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('id, name, display_name')
          .order('name');
        
        if (permissionsError) throw permissionsError;
        
        // Load access matrix entries
        const { data: matrixData, error: matrixError } = await supabase
          .from('access_matrix')
          .select('group_id, resource_id, permission_id');
        
        if (matrixError) throw matrixError;
        
        setUserGroups(groupsData);
        setResources(resourcesData);
        setPermissions(permissionsData);
        setAccessMatrixEntries(matrixData);
      } catch (error) {
        console.error("Error loading matrix data:", error);
        toast({
          title: "Error",
          description: "Failed to load access matrix data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [toast]);

  // Helper function to check if a specific permission exists
  const hasPermission = (groupId: string, resourceId: string, permissionId: string) => {
    return accessMatrixEntries.some(
      entry => entry.group_id === groupId && 
               entry.resource_id === resourceId && 
               entry.permission_id === permissionId
    );
  };

  // Rendering the matrix
  const renderMatrix = () => {
    if (userGroups.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No user groups found. Create user groups to configure permissions.
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {resources.map(resource => (
          <div key={resource.id} className="space-y-4">
            <h3 className="font-medium text-lg">{resource.display_name}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b">Group</th>
                    {permissions.map(permission => (
                      <th key={permission.id} className="text-center p-2 border-b">
                        {permission.display_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userGroups.map(group => (
                    <tr key={`${resource.id}-${group.id}`} className="border-b">
                      <td className="p-2">{group.name}</td>
                      {permissions.map(permission => (
                        <td key={`${resource.id}-${group.id}-${permission.id}`} className="text-center p-2">
                          <Checkbox
                            checked={hasPermission(group.id, resource.id, permission.id)}
                            disabled={true} // This is just a view, editing is done in group details
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Matrix</CardTitle>
        <CardDescription>
          Overview of all permissions assigned to user groups
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading access matrix...</div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            {renderMatrix()}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
