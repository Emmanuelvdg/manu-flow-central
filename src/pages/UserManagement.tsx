
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserGroupsList } from "@/components/user-management/UserGroupsList";
import { AccessMatrix } from "@/components/user-management/AccessMatrix";

const UserManagement = () => {
  return (
    <MainLayout title="User Management">
      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="groups">User Groups</TabsTrigger>
          <TabsTrigger value="access-matrix">Access Matrix</TabsTrigger>
        </TabsList>
        
        <TabsContent value="groups" className="space-y-6">
          <UserGroupsList />
        </TabsContent>
        
        <TabsContent value="access-matrix">
          <AccessMatrix />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default UserManagement;
