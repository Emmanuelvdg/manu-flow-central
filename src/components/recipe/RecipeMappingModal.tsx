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
import { supabase } from "@/integrations/supabase/client";
import { RecipeProductSelect } from "./RecipeProductSelect";
import { RecipeMaterialsSection } from "./RecipeMaterialsSection";
import { RecipePersonnelSection } from "./RecipePersonnelSection";
import { RecipeMachinesSection } from "./RecipeMachinesSection";

interface RecipeMappingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRecipe?: Recipe | null;
}

interface ProductOption {
  id: string;
  name: string;
}
interface MaterialOption {
  id: string;
  name: string;
  unit: string;
}
interface PersonnelRoleOption {
  id: string;
  role: string;
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
  const [productList, setProductList] = useState<ProductOption[]>([]);
  const [materialList, setMaterialList] = useState<MaterialOption[]>([]);
  const [personnelRoleList, setPersonnelRoleList] = useState<PersonnelRoleOption[]>([]);

  useEffect(() => {
    const mockProducts = [
      { id: "PFP_5L", name: "Packaged Food Product, 5L Canister" },
      { id: "WT", name: "Wooden Table" },
      { id: "BO00001", name: "Mechanical Subassembly BOM" },
    ];
    setProductList(mockProducts);

    const fetchMaterials = async () => {
      try {
        const { data: recipesData } = await supabase
          .from('recipes')
          .select('materials')
          .not('materials', 'is', null);
        if (recipesData && recipesData.length) {
          const materialsSet = new Set<string>();
          const materialsMap = new Map<string, string>();
          recipesData.forEach(recipe => {
            if (recipe.materials && Array.isArray(recipe.materials)) {
              recipe.materials.forEach((mat: any) => {
                if (mat.name) {
                  materialsSet.add(mat.name);
                  materialsMap.set(mat.name, mat.unit || 'pcs');
                }
              });
            }
          });
          const uniqueMaterials = Array.from(materialsSet).map(name => ({
            id: name,
            name,
            unit: materialsMap.get(name) || 'pcs'
          }));
          if (uniqueMaterials.length > 0) {
            setMaterialList(uniqueMaterials);
            return;
          }
        }
        setMaterialList([
          { id: "mat1", name: "Plastic Resin", unit: "kg" },
          { id: "mat2", name: "Sticker Label", unit: "pcs" },
        ]);
      } catch (error) {
        setMaterialList([
          { id: "mat1", name: "Plastic Resin", unit: "kg" },
          { id: "mat2", name: "Sticker Label", unit: "pcs" },
        ]);
      }
    };

    const fetchPersonnelRoles = async () => {
      try {
        const { data: recipesData } = await supabase
          .from('recipes')
          .select('personnel')
          .not('personnel', 'is', null);
        if (recipesData && recipesData.length) {
          const rolesSet = new Set<string>();
          recipesData.forEach(recipe => {
            if (recipe.personnel && Array.isArray(recipe.personnel)) {
              recipe.personnel.forEach((pers: any) => {
                if (pers.role) {
                  rolesSet.add(pers.role);
                }
              });
            }
          });
          const uniqueRoles = Array.from(rolesSet).map((role, index) => ({
            id: String(index + 1),
            role
          }));
          if (uniqueRoles.length > 0) {
            setPersonnelRoleList(uniqueRoles);
            return;
          }
        }
        setPersonnelRoleList([
          { id: "1", role: "Operator" },
          { id: "2", role: "Quality Control" },
        ]);
      } catch (error) {
        setPersonnelRoleList([
          { id: "1", role: "Operator" },
          { id: "2", role: "Quality Control" },
        ]);
      }
    };

    if (open) {
      fetchMaterials();
      fetchPersonnelRoles();
    }
  }, [open]);

  const [productId, setProductId] = useState(initialRecipe?.product_id || "");
  const [productName, setProductName] = useState(initialRecipe?.product_name || "");
  const [name, setName] = useState(initialRecipe?.name || "");
  const [description, setDescription] = useState(initialRecipe?.description || "");
  const [materials, setMaterials] = useState<Material[]>( initialRecipe?.materials ?? [] );
  const [personnel, setPersonnel] = useState<Personnel[]>( initialRecipe?.personnel ?? [] );
  const [machines, setMachines] = useState<Machine[]>( initialRecipe?.machines ?? [] );
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
      if (isEditing && initialRecipe) {
        await updateRecipe(initialRecipe.id, { ...payload });
      } else {
        await insertRecipe(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Failed to save recipe: " + err.message);
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
            disabled={isEditing}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Recipe Name<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
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
            />
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save" : "Create"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
