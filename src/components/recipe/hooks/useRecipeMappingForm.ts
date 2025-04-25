
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMaterialsManagement } from "./useMaterialsManagement";
import { usePersonnelManagement } from "./usePersonnelManagement";
import { useMachineManagement } from "./useMachineManagement";
import { useRecipeReferenceData } from "./useRecipeReferenceData";

export function useRecipeMappingForm(
  isOpen: boolean,
  initialRecipe: any,
  onSuccess: () => void,
  onClose: () => void
) {
  // States for form fields
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [variantId, setVariantId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Reuse existing hooks for managing recipe components
  const { 
    materials, setMaterials,
    showMaterials, setShowMaterials,
    editingMaterial, setEditingMaterial,
    handleAddMaterial, handleEditMaterial, handleSaveMaterial, handleDeleteMaterial
  } = useMaterialsManagement();
  
  const { 
    personnel, setPersonnel,
    showPersonnel, setShowPersonnel,
    editingPersonnel, setEditingPersonnel,
    handleAddPersonnel, handleEditPersonnel, handleSavePersonnel, handleDeletePersonnel
  } = usePersonnelManagement();
  
  const { 
    machines, setMachines,
    showMachines, setShowMachines,
    editingMachine, setEditingMachine,
    handleAddMachine, handleEditMachine, handleSaveMachine, handleDeleteMachine
  } = useMachineManagement();

  // Reference data (products, materials, personnel)
  const { productList, materialList, personnelRoleList, loading: refDataLoading } = useRecipeReferenceData();
  
  // Toast for notifications
  const { toast } = useToast();

  // Is this an edit operation?
  const isEditing = !!initialRecipe;

  // Reset form when modal opens/closes or when editing a different recipe
  useEffect(() => {
    if (isOpen) {
      setLoading(refDataLoading);
      
      if (initialRecipe) {
        console.log("Setting up form for editing recipe:", initialRecipe);
        // Populate form with initial recipe data
        setProductId(initialRecipe.product_id || "");
        setProductName(initialRecipe.product_name || "");
        setName(initialRecipe.name || "");
        setDescription(initialRecipe.description || "");
        setVariantId(initialRecipe.variantId || "");
        
        // Set recipe components
        setMaterials(initialRecipe.materials || []);
        setPersonnel(initialRecipe.personnel || []);
        setMachines(initialRecipe.machines || []);
      } else {
        // Reset form for new recipe
        setProductId("");
        setProductName("");
        setName("");
        setDescription("");
        setVariantId("");
        setMaterials([]);
        setPersonnel([]);
        setMachines([]);
      }
    }
  }, [isOpen, initialRecipe, refDataLoading]);

  // Handle product selection
  const handleProductChange = (id: string) => {
    console.log("Product changed to:", id);
    setProductId(id);
    
    // Try to find the product in the list to get its name
    const product = productList.find(p => p.id === id);
    if (product) {
      console.log("Found product:", product);
      setProductName(product.name);
      // Auto-set recipe name if empty
      if (!name) {
        setName(`${product.name} Recipe`);
      }
    } else {
      console.log("Product not found in list");
    }
    
    // Reset variant when product changes
    setVariantId("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive"
      });
      return;
    }
    
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a recipe name",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const recipeData = {
        product_id: productId,
        product_name: productName,
        name,
        description,
        materials,
        personnel,
        machines,
        variantId: variantId || null
      };
      
      console.log("Saving recipe:", recipeData);
      
      if (isEditing) {
        // Update existing recipe
        const { error } = await supabase
          .from("recipes")
          .update(recipeData)
          .eq("id", initialRecipe.id);
          
        if (error) throw error;
        
        toast({
          title: "Recipe Updated",
          description: `${name} has been updated successfully.`
        });
      } else {
        // Create new recipe
        const { error } = await supabase
          .from("recipes")
          .insert(recipeData);
          
        if (error) throw error;
        
        toast({
          title: "Recipe Created",
          description: `${name} has been created successfully.`
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving the recipe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    productId,
    productName,
    name,
    description,
    variantId,
    materials,
    personnel,
    machines,
    productList,
    materialList,
    personnelRoleList,
    showMaterials,
    showPersonnel,
    showMachines,
    editingMaterial,
    editingPersonnel,
    editingMachine,
    loading: loading || refDataLoading,
    isEditing,
    setProductId,
    setProductName,
    setName,
    setDescription,
    setVariantId,
    setMaterials,
    setPersonnel,
    setMachines,
    setShowMaterials,
    setShowPersonnel,
    setShowMachines,
    setEditingMaterial,
    setEditingPersonnel,
    setEditingMachine,
    handleSubmit,
    handleProductChange,
    handleAddMaterial,
    handleEditMaterial,
    handleSaveMaterial,
    handleDeleteMaterial,
    handleAddPersonnel,
    handleEditPersonnel,
    handleSavePersonnel,
    handleDeletePersonnel,
    handleAddMachine,
    handleEditMachine,
    handleSaveMachine,
    handleDeleteMachine
  };
}
