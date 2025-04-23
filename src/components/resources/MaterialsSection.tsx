
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MaterialEditDialog } from "./MaterialEditDialog";
import { PurchaseOrderDialog } from "./PurchaseOrderDialog";
import { Material, PurchaseOrder } from "@/types/material";
import { MaterialsTable } from "./MaterialsTable";
import { PurchaseOrdersTable } from "./PurchaseOrdersTable";
import { fetchMaterials } from "@/components/recipe/recipeDataUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// We'll provide fallback mock POs only for demo—real data integration can be added later if relevant.
const mockPurchaseOrders: PurchaseOrder[] = [
  { id: "po-001", materialId: "mat-001", quantity: 20, status: "ordered", orderDate: "2025-03-01", expectedDelivery: "2025-03-15", vendor: "MetalWorks Ltd", totalCost: 250 },
  { id: "po-002", materialId: "mat-004", quantity: 500, status: "delivered", orderDate: "2025-02-15", expectedDelivery: "2025-02-28", vendor: "SealMaster", totalCost: 125 },
  { id: "po-003", materialId: "mat-006", quantity: 50, status: "ordered", orderDate: "2025-03-05", expectedDelivery: "2025-03-20", vendor: "CircuitPro", totalCost: 340 },
];

export const MaterialsSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch materials from Supabase
  const { data: dbMaterials = [], isLoading, error } = useQuery({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
  });

  // These manage dialog state as before, but use DB data as source.
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [purchaseOrders, setPurchaseOrders] = React.useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [selectedMaterial, setSelectedMaterial] = React.useState<Material | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = React.useState(false);

  // Sync 'materials' state when DB loads - properly map the dbMaterials to the Material type
  React.useEffect(() => {
    if (dbMaterials && dbMaterials.length > 0) {
      const formattedMaterials: Material[] = dbMaterials.map((m) => ({
        id: m.id,
        name: m.name,
        unit: m.unit,
        // The MaterialOption type doesn't have these properties, so we provide default values
        category: m.category || "",
        status: m.status || "Active",
        vendor: m.vendor || "",
        batches: [],
        stock: 0,
        costPerUnit: 0
      }));
      setMaterials(formattedMaterials);
    }
  }, [dbMaterials]);

  // The rest: handlers for dialogs, formatters (kept nearly the same)
  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  };

  const handleCreateOrder = (material: Material) => {
    setSelectedMaterial(material);
    setIsPurchaseDialogOpen(true);
  };

  const handleSaveMaterial = async (updatedMaterial: Material) => {
    try {
      // Check if this is a new material or an update
      const isNewMaterial = !materials.some((m) => m.id === updatedMaterial.id);
      
      // Save to Supabase
      const materialData = {
        id: updatedMaterial.id,
        name: updatedMaterial.name,
        category: updatedMaterial.category,
        unit: updatedMaterial.unit,
        status: updatedMaterial.status,
        vendor: updatedMaterial.vendor
      };
      
      if (isNewMaterial) {
        const { error: insertError } = await supabase.from("materials").insert(materialData);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from("materials")
          .update(materialData)
          .eq("id", updatedMaterial.id);
        if (updateError) throw updateError;
      }
      
      // Invalidate and refetch the materials query to update the UI
      await queryClient.invalidateQueries({ queryKey: ["materials"] });
      
      // Update local state for immediate UI feedback
      setMaterials(prev => {
        const filtered = prev.filter((m) => m.id !== updatedMaterial.id);
        return [...filtered, updatedMaterial];
      });
      
      toast({
        title: isNewMaterial ? "Material Added" : "Material Updated",
        description: `${updatedMaterial.name} has been ${isNewMaterial ? "added" : "updated"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving material:", error);
      toast({
        title: "Error",
        description: `Failed to save material: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleCreatePurchaseOrder = (newPO: PurchaseOrder) => {
    setPurchaseOrders([...purchaseOrders, { ...newPO, id: `po-${Date.now()}` }]);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(dateString);
    }
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '$0.00';
    try {
      return `$${value.toFixed(2)}`;
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `$${String(value)}`;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Materials</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setSelectedMaterial({
                id: `mat-${Date.now()}`,
                name: "",
                category: "",
                unit: "",
                status: "Active",
                vendor: "",
                batches: [],
              });
              setIsEditDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Material
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground py-8 text-center">Loading materials...</div>
          ) : error ? (
            <div className="text-destructive py-8 text-center">Could not load materials. {String(error)}</div>
          ) : (
            <MaterialsTable
              materials={materials}
              onEditMaterial={handleEditMaterial}
              onCreateOrder={handleCreateOrder}
              formatCurrency={formatCurrency}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseOrdersTable
            purchaseOrders={purchaseOrders}
            materials={materials}
            formatDate={formatDate}
          />
        </CardContent>
      </Card>

      {selectedMaterial && (
        <>
          <MaterialEditDialog
            material={selectedMaterial}
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSave={handleSaveMaterial}
          />
          <PurchaseOrderDialog
            material={selectedMaterial}
            isOpen={isPurchaseDialogOpen}
            onClose={() => setIsPurchaseDialogOpen(false)}
            onCreateOrder={handleCreatePurchaseOrder}
          />
        </>
      )}
    </>
  );
};
