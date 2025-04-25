
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { insertRecipe, updateRecipe, Recipe } from "../recipeUtils";
import { useRecipeReferenceData } from "./useRecipeReferenceData";
import { useMaterialsManagement } from "./useMaterialsManagement";
import { usePersonnelManagement } from "./usePersonnelManagement";
import { useMachineManagement } from "./useMachineManagement";

export function useRecipeMappingForm(
  open: boolean, 
  initialRecipe?: Recipe | null, 
  onSuccess?: () => void, 
  onClose?: () => void
) {
  const { toast } = useToast();
  const { 
    productList, 
    materialList, 
    personnelRoleList, 
    loading, 
    dataLoaded 
  } = useRecipeReferenceData(open);

  const materialsManager = useMaterialsManagement();
  const personnelManager = usePersonnelManagement();
  const machinesManager = useMachineManagement();

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Product select handler
  const handleProductChange = (id: string) => {
    console.log("Product changed to:", id);
    setProductId(id);
    
    const prod = productList.find(p => p.id === id);
    
    if (prod) {
      console.log("Found product in list:", prod);
      setProductName(prod.name);
    } else {
      console.log("Product not found in list, keeping name:", productName);
    }
  };

  // Populate/reset form on open/recipe change
  useEffect(() => {
    if (initialRecipe && dataLoaded) {
      console.log("Initializing form with recipe:", initialRecipe);
      
      setProductId(initialRecipe.product_id || "");
      setProductName(initialRecipe.product_name || "");
      setName(initialRecipe.name || "");
      setDescription(initialRecipe.description || "");
      materialsManager.setMaterials(initialRecipe.materials || []);
      personnelManager.setPersonnel(initialRecipe.personnel || []);
      machinesManager.setMachines(initialRecipe.machines || []);
      
      const matchingProduct = productList.find(p => p.id === initialRecipe.product_id);
      console.log(`Product ${initialRecipe.product_id} exists in list: ${Boolean(matchingProduct)}`);
      console.log("Product list size when setting initial values:", productList.length);
      
      if (!matchingProduct && initialRecipe.product_id) {
        console.log(`Product ${initialRecipe.product_id} not found in product list`);
      }
    } else if (!initialRecipe && open) {
      // Reset form when opening the modal for a new recipe
      setProductId("");
      setProductName("");
      setName("");
      setDescription("");
      materialsManager.setMaterials([]);
      personnelManager.setPersonnel([]);
      machinesManager.setMachines([]);
    }
    
    // Always reset UI state
    if (open) {
      materialsManager.setShowMaterials(true);
      personnelManager.setShowPersonnel(false);
      machinesManager.setShowMachines(false);
      materialsManager.setEditingMaterial(null);
      personnelManager.setEditingPersonnel(null);
      machinesManager.setEditingMachine(null);
    }
  }, [initialRecipe, open, dataLoaded, productList]);

  // Submit handler
  const isEditing = Boolean(initialRecipe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !name) {
      toast({ 
        title: "Missing required fields", 
        description: "Product ID and Recipe Name are required",
        variant: "destructive"
      });
      return;
    }
    
    const finalProductName = productName || (isEditing && initialRecipe ? initialRecipe.product_name : "");
    
    if (!finalProductName) {
      toast({
        title: "Product name missing",
        description: "Could not determine product name",
        variant: "destructive"
      });
      return;
    }
    
    const payload = {
      product_id: productId,
      product_name: finalProductName,
      name,
      description,
      materials: materialsManager.materials,
      personnel: personnelManager.personnel,
      machines: machinesManager.machines,
    };
    
    try {
      if (isEditing && initialRecipe) {
        await updateRecipe(initialRecipe.id, { ...payload });
        toast({ title: "Success", description: "Recipe updated successfully" });
      } else {
        await insertRecipe(payload);
        toast({ title: "Success", description: "Recipe created successfully" });
      }
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      toast({
        title: "Error saving recipe",
        description: err.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  return {
    productList,
    materialList,
    personnelRoleList,
    loading,
    productId,
    setProductId,
    productName,
    setProductName,
    name,
    setName,
    description,
    setDescription,
    handleProductChange,
    handleSubmit,
    isEditing,
    ...materialsManager,
    ...personnelManager,
    ...machinesManager
  };
}
