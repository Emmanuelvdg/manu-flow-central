
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
    return <div>Error loading materials: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <MaterialsHeader 
        onNewMaterial={handleNewMaterial}
        onBulkUpload={handleBulkUpload}
      />
      
      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <MaterialsTable
                materials={materials}
                onEditMaterial={handleEditMaterial}
                onCreateOrder={handleCreateOrder}
                formatCurrency={formatCurrency}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocations" className="space-y-4">
          <BatchAllocationManager />
          <MaterialStockReport />
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
          onProcessOrder={handleProcessPurchaseOrder}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};
