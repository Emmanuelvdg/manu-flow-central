
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertRecipe, updateRecipe, Recipe } from "./recipeUtils";
import { RecipeProductSelect } from "./RecipeProductSelect";
import { RecipeMaterialsSection } from "./RecipeMaterialsSection";
import { RecipePersonnelSection } from "./RecipePersonnelSection";
import { RecipeMachinesSection } from "./RecipeMachinesSection";
import { 
  fetchProducts, 
  fetchMaterials, 
  fetchPersonnelRoles, 
  ProductOption, 
  MaterialOption, 
  PersonnelRoleOption 
} from "./recipeDataUtils";
import { useToast } from "@/components/ui/use-toast";

interface RecipeMappingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRecipe?: Recipe | null;
}

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}
interface Personnel {
  id: string;
  role: string;
  hours: number;
}
interface Machine {
  id: string;
  machine: string;
  hours: number;
}

export default function RecipeMappingModal({
  open,
  onClose,
  onSuccess,
  initialRecipe,
}: RecipeMappingModalProps) {
  const { toast } = useToast();
  const [productList, setProductList] = useState<ProductOption[]>([]);
  const [materialList, setMaterialList] = useState<MaterialOption[]>([]);
  const [personnelRoleList, setPersonnelRoleList] = useState<PersonnelRoleOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      if (open) {
        setLoading(true);
        try {
          // Fetch products, materials and personnel roles in parallel
          const [products, materials, personnelRoles] = await Promise.all([
            fetchProducts(),
            fetchMaterials(),
            fetchPersonnelRoles()
          ]);
          
          setProductList(products);
          setMaterialList(materials);
          setPersonnelRoleList(personnelRoles);
        } catch (error) {
          console.error("Error loading recipe data:", error);
          toast({
            title: "Error loading data",
            description: "Could not load products and materials. Using fallback data.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [open, toast]);

  const [productId, setProductId] = useState(initialRecipe?.product_id || "");
  const [productName, setProductName] = useState(initialRecipe?.product_name || "");
  const [name, setName] = useState(initialRecipe?.name || "");
  const [description, setDescription] = useState(initialRecipe?.description || "");
  const [materials, setMaterials] = useState<Material[]>(initialRecipe?.materials ?? []);
  const [personnel, setPersonnel] = useState<Personnel[]>(initialRecipe?.personnel ?? []);
  const [machines, setMachines] = useState<Machine[]>(initialRecipe?.machines ?? []);
  const [showMaterials, setShowMaterials] = useState(true);
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [showMachines, setShowMachines] = useState(false);

  const [editingMaterial, setEditingMaterial] = useState<Partial<Material> | null>(null);
  const [editingPersonnel, setEditingPersonnel] = useState<Partial<Personnel> | null>(null);
  const [editingMachine, setEditingMachine] = useState<Partial<Machine> | null>(null);

  useEffect(() => {
    setProductId(initialRecipe?.product_id || "");
    setProductName(initialRecipe?.product_name || "");
    setName(initialRecipe?.name || "");
    setDescription(initialRecipe?.description || "");
    setMaterials(initialRecipe?.materials ?? []);
    setPersonnel(initialRecipe?.personnel ?? []);
    setMachines(initialRecipe?.machines ?? []);
    setShowMaterials(true);
    setShowPersonnel(false);
    setShowMachines(false);
    setEditingMaterial(null);
    setEditingPersonnel(null);
    setEditingMachine(null);
  }, [initialRecipe, open]);

  const isEditing = Boolean(initialRecipe);

  const handleAddMaterial = () => setEditingMaterial({ id: "", name: "", quantity: 1, unit: "" });
  const handleEditMaterial = (mat: Material) => setEditingMaterial({ ...mat });
  const handleSaveMaterial = () => {
    if (!editingMaterial?.name || !editingMaterial.unit) return;
    if (editingMaterial.id) {
      setMaterials(mats =>
        mats.map(m => (m.id === editingMaterial.id ? { ...editingMaterial, id: editingMaterial.id } as Material : m))
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

  const handleAddPersonnel = () => setEditingPersonnel({ id: "", role: "", hours: 1 });
  const handleEditPersonnel = (p: Personnel) => setEditingPersonnel({ ...p });
  const handleSavePersonnel = () => {
    if (!editingPersonnel?.role) return;
    if (editingPersonnel.id) {
      setPersonnel(arr =>
        arr.map(p => (p.id === editingPersonnel.id ? { ...editingPersonnel, id: editingPersonnel.id } as Personnel : p))
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

  const handleAddMachine = () => setEditingMachine({ id: "", machine: "", hours: 1 });
  const handleEditMachine = (m: Machine) => setEditingMachine({ ...m });
  const handleSaveMachine = () => {
    if (!editingMachine?.machine) return;
    if (editingMachine.id) {
      setMachines(arr =>
        arr.map(m => (m.id === editingMachine.id ? { ...editingMachine, id: editingMachine.id } as Machine : m))
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

  const handleProductChange = (id: string) => {
    setProductId(id);
    const prod = productList.find(p => p.id === id);
    setProductName(prod ? prod.name : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !productName || !name) return;

    const payload = {
      product_id: productId,
      product_name: productName,
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
        toast({
          title: "Success",
          description: "Recipe updated successfully"
        });
      } else {
        await insertRecipe(payload);
        toast({
          title: "Success",
          description: "Recipe created successfully"
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving recipe:", err);
      toast({
        title: "Error saving recipe",
        description: err.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Recipe Mapping" : "Create Recipe Mapping"}</DialogTitle>
          <DialogDescription>
            Connect a recipe to a product by selecting a product and adding recipe, materials, personnel & machine details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <RecipeProductSelect
            productList={productList}
            productId={productId}
            onProductChange={handleProductChange}
            disabled={isEditing || loading}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Recipe Name<span className="text-red-500">*</span></label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="pt-2">
            <RecipeMaterialsSection
              materials={materials}
              setMaterials={setMaterials}
              materialList={materialList}
              showMaterials={showMaterials}
              setShowMaterials={setShowMaterials}
              editingMaterial={editingMaterial}
              setEditingMaterial={setEditingMaterial}
              handleAddMaterial={handleAddMaterial}
              handleEditMaterial={handleEditMaterial}
              handleSaveMaterial={handleSaveMaterial}
              handleDeleteMaterial={handleDeleteMaterial}
              disabled={loading}
            />
            <RecipePersonnelSection
              personnel={personnel}
              personnelRoleList={personnelRoleList}
              showPersonnel={showPersonnel}
              setShowPersonnel={setShowPersonnel}
              editingPersonnel={editingPersonnel}
              setEditingPersonnel={setEditingPersonnel}
              handleAddPersonnel={handleAddPersonnel}
              handleEditPersonnel={handleEditPersonnel}
              handleSavePersonnel={handleSavePersonnel}
              handleDeletePersonnel={handleDeletePersonnel}
              disabled={loading}
            />
            <RecipeMachinesSection
              machines={machines}
              showMachines={showMachines}
              setShowMachines={setShowMachines}
              editingMachine={editingMachine}
              setEditingMachine={setEditingMachine}
              handleAddMachine={handleAddMachine}
              handleEditMachine={handleEditMachine}
              handleSaveMachine={handleSaveMachine}
              handleDeleteMachine={handleDeleteMachine}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Save" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
