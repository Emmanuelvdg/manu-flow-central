
import React from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MaterialsHeader } from "../MaterialsHeader";
import { MaterialsTable } from "../MaterialsTable";
import { MaterialDialogs } from "../MaterialDialogs";
import { useMaterialsManager } from "./hooks/useMaterialsManager";
import { MaterialsLoadingState } from "../MaterialsLoadingState";
import { ErrorBoundary } from "../ErrorBoundary";
import { PurchaseOrdersSection } from "../PurchaseOrdersSection";
import { MaterialStockReport } from "../MaterialStockReport";

export const MaterialsMainView = () => {
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
    purchaseOrders
  } = useMaterialsManager();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading materials</AlertTitle>
        <AlertDescription>{String(error)}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <MaterialsLoadingState />;
  }

  return (
    <div className="space-y-8">
      <ErrorBoundary>
        <>
          <Card>
            <MaterialsHeader 
              onNewMaterial={handleNewMaterial} 
              onBulkUpload={handleBulkUpload}
              existingMaterials={materials}
            />
            <Card.Content>
              <MaterialsTable
                materials={materials}
                onEditMaterial={handleEditMaterial}
                onCreateOrder={handleCreateOrder}
                formatCurrency={formatCurrency}
              />
            </Card.Content>
          </Card>

          <PurchaseOrdersSection 
            purchaseOrders={purchaseOrders}
            materials={materials}
            formatDate={formatDate}
          />

          <MaterialDialogs
            selectedMaterial={selectedMaterial}
            isEditDialogOpen={isEditDialogOpen}
            isPurchaseDialogOpen={isPurchaseDialogOpen}
            onCloseEditDialog={onCloseEditDialog}
            onClosePurchaseDialog={onClosePurchaseDialog}
            onSaveMaterial={handleSaveMaterial}
            onCreateOrder={handleProcessPurchaseOrder}
          />
        </>
      </ErrorBoundary>

      <MaterialStockReport />
    </div>
  );
};

export default MaterialsMainView;
