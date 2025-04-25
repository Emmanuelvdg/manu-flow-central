
import { useState, useEffect } from "react";
import { insertRecipe, updateRecipe, Recipe } from "./recipeUtils";
import { fetchProducts, fetchMaterials, fetchPersonnelRoles, ProductOption, MaterialOption, PersonnelRoleOption } from "./recipeDataUtils";
import { useToast } from "@/components/ui/use-toast";

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}
export interface Personnel {
  id: string;
  role: string;
  hours: number;
}
export interface Machine {
  id: string;
  machine: string;
  hours: number;
}

export function useRecipeMappingForm(open: boolean, initialRecipe?: Recipe | null, onSuccess?: () => void, onClose?: () => void) {
  const { toast } = useToast();

  // Reference data
  const [productList, setProductList] = useState<ProductOption[]>([]);
  const [materialList, setMaterialList] = useState<MaterialOption[]>([]);
  const [personnelRoleList, setPersonnelRoleList] = useState<PersonnelRoleOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  
  // UI
  const [showMaterials, setShowMaterials] = useState(true);
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [showMachines, setShowMachines] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Partial<Material> | null>(null);
  const [editingPersonnel, setEditingPersonnel] = useState<Partial<Personnel> | null>(null);
  const [editingMachine, setEditingMachine] = useState<Partial<Machine> | null>(null);

  // Load reference data when modal opens
  useEffect(() => {
    const loadData = async () => {
      if (!open) return;
      setLoading(true);
      try {
        const [products, materials, personnelRoles] = await Promise.all([
          fetchProducts(),
          fetchMaterials(),
          fetchPersonnelRoles()
        ]);
        setProductList(products);
        setMaterialList(materials);
        setPersonnelRoleList(personnelRoles);
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "Could not load products and materials. Using fallback data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [open, toast]);

  // Populate/reset form on open/recipe change
  useEffect(() => {
    if (initialRecipe) {
      console.log("Initializing form with recipe:", initialRecipe);
      setProductId(initialRecipe.product_id || "");
      setProductName(initialRecipe.product_name || "");
      setName(initialRecipe.name || "");
      setDescription(initialRecipe.description || "");
      setMaterials(initialRecipe.materials || []);
      setPersonnel(initialRecipe.personnel || []);
      setMachines(initialRecipe.machines || []);
    } else {
      setProductId("");
      setProductName("");
      setName("");
      setDescription("");
      setMaterials([]);
      setPersonnel([]);
      setMachines([]);
    }
    setShowMaterials(true);
    setShowPersonnel(false);
    setShowMachines(false);
    setEditingMaterial(null);
    setEditingPersonnel(null);
    setEditingMachine(null);
  }, [initialRecipe, open]);

  // Material handlers
  const handleAddMaterial = () => setEditingMaterial({ id: "", name: "", quantity: 1, unit: "" });
  const handleEditMaterial = (mat: Material) => setEditingMaterial({ ...mat });
  const handleSaveMaterial = () => {
    if (!editingMaterial?.name || !editingMaterial.unit) return;
    if (editingMaterial.id) {
      setMaterials(mats => 
        mats.map(m => m.id === editingMaterial.id ? { ...editingMaterial, id: editingMaterial.id } as Material : m)
      );
    } else {
      setMaterials(mats => [
        ...mats,
        { ...editingMaterial, id: Date.now().toString() } as Material
      ]);
    }
    setEditingMaterial(null);
  };
  const handleDeleteMaterial = (id: string) => setMaterials(mats => mats.filter(m => m.id !== id));

  // Personnel handlers
  const handleAddPersonnel = () => setEditingPersonnel({ id: "", role: "", hours: 1 });
  const handleEditPersonnel = (p: Personnel) => setEditingPersonnel({ ...p });
  const handleSavePersonnel = () => {
    if (!editingPersonnel?.role) return;
    if (editingPersonnel.id) {
      setPersonnel(arr => 
        arr.map(p => p.id === editingPersonnel.id ? { ...editingPersonnel, id: editingPersonnel.id } as Personnel : p)
      );
    } else {
      setPersonnel(arr => [
        ...arr,
        { ...editingPersonnel, id: Date.now().toString() } as Personnel
      ]);
    }
    setEditingPersonnel(null);
  };
  const handleDeletePersonnel = (id: string) => setPersonnel(arr => arr.filter(p => p.id !== id));

  // Machine handlers
  const handleAddMachine = () => setEditingMachine({ id: "", machine: "", hours: 1 });
  const handleEditMachine = (m: Machine) => setEditingMachine({ ...m });
  const handleSaveMachine = () => {
    if (!editingMachine?.machine) return;
    if (editingMachine.id) {
      setMachines(arr => 
        arr.map(m => m.id === editingMachine.id ? { ...editingMachine, id: editingMachine.id } as Machine : m)
      );
    } else {
      setMachines(arr => [
        ...arr,
        { ...editingMachine, id: Date.now().toString() } as Machine
      ]);
    }
    setEditingMachine(null);
  };
  const handleDeleteMachine = (id: string) => setMachines(arr => arr.filter(m => m.id !== id));

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
    
    // Use existing product name if not found in the list but we're editing
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
      materials,
      personnel,
      machines,
    };
    
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    materials,
    setMaterials,
    personnel,
    setPersonnel,
    machines,
    setMachines,
    showMaterials,
    setShowMaterials,
    showPersonnel,
    setShowPersonnel,
    showMachines,
    setShowMachines,
    editingMaterial,
    setEditingMaterial,
    editingPersonnel,
    setEditingPersonnel,
    editingMachine,
    setEditingMachine,
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
    handleDeleteMachine,
    handleProductChange,
    handleSubmit,
    isEditing
  };
}
