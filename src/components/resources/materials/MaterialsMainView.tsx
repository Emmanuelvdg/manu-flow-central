
import React from 'react';
import { useMaterialsManager } from './hooks/useMaterialsManager';
import { MaterialsHeader } from '../MaterialsHeader';
import { MaterialsTable } from '../MaterialsTable';
import { MaterialStockReport } from '../MaterialStockReport';
import { MaterialsLoadingState } from '../MaterialsLoadingState';
import { MaterialEditDialog } from '../MaterialEditDialog';
import { PurchaseOrderDialog } from '../PurchaseOrderDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BatchAllocationManager } from './BatchAllocationManager';
import { ScrollArea } from '@/components/ui/scroll-area';

export const MaterialsMainView: React.FC = () => {
  const {
    materials,
    selectedMaterial,
    isLoading,
    error,
    isEditDialogOpen,
    isPurchaseDialogOpen,
    formatCurrency,
    formatDate,
    handleEditMaterial,
    handleCreateOrder,
    handleNewMaterial,
    handleSaveMaterial,
    handleProcessPurchaseOrder,
    handleBulkUpload,
    onCloseEditDialog,
    onClosePurchaseDialog,
    purchaseOrders,
  } = useMaterialsManager();

  if (isLoading) {
    return <MaterialsLoadingState />;
  }

  if (error) {
    return <div>Error loading materials: {error instanceof Error ? error.message : "Unknown error"}</div>;
  }

  return (
    <div className="space-y-4">
      <MaterialsHeader 
        onNewMaterial={handleNewMaterial}
        onBulkUpload={handleBulkUpload}
        existingMaterials={materials}
      />
      
      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardContent className="pt-6 p-0 sm:p-6">
              <ScrollArea className="h-[calc(100vh-280px)] w-full">
                <div className="min-w-[900px] px-6 pb-6">
                  <MaterialsTable
                    materials={materials}
                    onEditMaterial={handleEditMaterial}
                    onCreateOrder={handleCreateOrder}
                    formatCurrency={formatCurrency}
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocations" className="space-y-4">
          <ScrollArea className="w-full">
            <div className="min-w-[900px]">
              <BatchAllocationManager />
              <MaterialStockReport />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {isEditDialogOpen && selectedMaterial && (
        <MaterialEditDialog
          material={selectedMaterial}
          isOpen={isEditDialogOpen}
          onClose={onCloseEditDialog}
          onSave={handleSaveMaterial}
        />
      )}

      {isPurchaseDialogOpen && selectedMaterial && (
        <PurchaseOrderDialog
          material={selectedMaterial}
          isOpen={isPurchaseDialogOpen}
          onClose={onClosePurchaseDialog}
          onSubmitOrder={handleProcessPurchaseOrder}
        />
      )}
    </div>
  );
};
