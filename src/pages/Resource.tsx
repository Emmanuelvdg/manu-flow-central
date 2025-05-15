
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonnelTable } from "@/components/resources/PersonnelTable";
import { MachinesTable } from "@/components/resources/MachinesTable";
import { MaterialsSection } from "@/components/resources/MaterialsSection";
import { RoutingSection } from "@/components/resources/RoutingSection";
import { PurchaseOrdersSection } from "@/components/resources/PurchaseOrdersSection";
import { usePurchaseOrders } from "@/components/resources/hooks/usePurchaseOrders";
import { useMaterials } from "@/components/resources/hooks/useMaterials";
import { formatDate } from "@/components/dashboard/quotes/utils/formatUtils";

const Resource = () => {
  const { purchaseOrders } = usePurchaseOrders();
  const { materials } = useMaterials();
  
  return (
    <MainLayout title="Resources & Inventory">
      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          <MaterialsSection />
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-6">
          <PurchaseOrdersSection 
            purchaseOrders={purchaseOrders} 
            materials={materials} 
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="personnel">
          <PersonnelTable />
        </TabsContent>

        <TabsContent value="machines">
          <MachinesTable />
        </TabsContent>

        <TabsContent value="routing">
          <RoutingSection />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Resource;
