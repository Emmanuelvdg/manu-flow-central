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
import { Minus, Pencil, Plus, Trash } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

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
    supabase.from("products").select("id, name")
      .then(({ data, error }) => {
        if (!error && data && data.length) {
          setProductList(data.map((p: any) => ({ id: String(p.id), name: p.name })));
        } else {
          setProductList([
            { id: "PFP_5L", name: "Packaged Food Product, 5L Canister" },
            { id: "WT", name: "Wooden Table" },
            { id: "BO00001", name: "Mechanical Subassembly BOM" },
          ]);
        }
      });
    supabase.from("materials").select("id, name, unit")
      .then(({ data, error }) => {
        if (!error && data && data.length) {
          setMaterialList(data.map((m: any) => ({
            id: String(m.id), name: m.name, unit: m.unit
          })));
        } else {
          setMaterialList([
            { id: "mat1", name: "Plastic Resin", unit: "kg" },
            { id: "mat2", name: "Sticker Label", unit: "pcs" },
          ]);
        }
      });
    supabase.from("personnel").select("id, role")
      .then(({ data, error }) => {
        if (!error && data && data.length) {
          const seen = new Set();
          const roles: PersonnelRoleOption[] = [];
          data.forEach((p: any) => {
            if (p.role && !seen.has(p.role)) {
              seen.add(p.role);
              roles.push({ id: String(p.id), role: p.role });
            }
          });
          setPersonnelRoleList(roles);
        } else {
          setPersonnelRoleList([
            { id: "1", role: "Operator" },
            { id: "2", role: "Quality Control" },
          ]);
        }
      });
  }, [open]);

  const [productId, setProductId] = useState(initialRecipe?.product_id || "");
  const [productName, setProductName] = useState(initialRecipe?.product_name || "");
  const [name, setName] = useState(initialRecipe?.name || "");
  const [description, setDescription] = useState(initialRecipe?.description || "");
  const [materials, setMaterials] = useState<Material[]>(
    initialRecipe?.materials ?? []
  );
  const [personnel, setPersonnel] = useState<Personnel[]>(
    initialRecipe?.personnel ?? []
  );
  const [machines, setMachines] = useState<Machine[]>(
    initialRecipe?.machines ?? []
  );
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
          <div>
            <label className="block text-sm font-medium mb-1">Product<span className="text-red-500">*</span></label>
            <Select
              value={productId}
              onValueChange={handleProductChange}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {productList.map(opt => (
                  <SelectItem key={opt.id} value={opt.id}>{opt.name} ({opt.id})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recipe Name<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="pt-2">
            <div>
              <button
                type="button"
                className="flex items-center w-full mb-2"
                onClick={() => setShowMaterials((v) => !v)}
              >
                <span className="font-semibold text-indigo-700 pr-2">Materials ({materials.length})</span>
                <span>{showMaterials ? <Minus size={16} /> : <Plus size={16} />}</span>
              </button>
              {showMaterials && (
                <div className="mb-4 border rounded-lg bg-gray-50 p-2 space-y-2">
                  <table className="w-full text-xs mb-1">
                    <thead>
                      <tr>
                        <th className="text-left py-1 px-2">Name</th>
                        <th className="text-left py-1 px-2">Quantity</th>
                        <th className="text-left py-1 px-2">Unit</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((mat) => (
                        <tr key={mat.id}>
                          <td className="px-2 py-1">{mat.name}</td>
                          <td className="px-2 py-1">{mat.quantity}</td>
                          <td className="px-2 py-1">{mat.unit}</td>
                          <td className="px-2 py-1 flex gap-1">
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleEditMaterial(mat)}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleDeleteMaterial(mat.id)}>
                              <Trash className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {editingMaterial && (
                    <div className="flex gap-2 items-end">
                      <Select
                        value={editingMaterial.name || ""}
                        onValueChange={v => {
                          const mat = materialList.find(m => m.name === v);
                          setEditingMaterial(m => ({
                            ...m!,
                            name: v,
                            unit: mat?.unit ?? (m?.unit ?? "")
                          }));
                        }}
                      >
                        <SelectTrigger className="w-48 text-xs">
                          <SelectValue placeholder="Material name" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialList.map(mat => (
                            <SelectItem key={mat.id} value={mat.name}>{mat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Qty"
                        type="number"
                        min={1}
                        className="w-16 text-xs"
                        value={editingMaterial.quantity ?? 1}
                        onChange={e => setEditingMaterial(m => ({ ...m!, quantity: Number(e.target.value) }))}
                      />
                      <Input
                        placeholder="Unit"
                        className="w-16 text-xs"
                        value={editingMaterial.unit ?? ""}
                        readOnly
                      />
                      <Button variant="outline" size="sm" type="button" onClick={handleSaveMaterial}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" type="button" onClick={() => setEditingMaterial(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                  {!editingMaterial && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="text-xs mt-1"
                      onClick={handleAddMaterial}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Material
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                className="flex items-center w-full mb-2"
                onClick={() => setShowPersonnel((v) => !v)}
              >
                <span className="font-semibold text-green-700 pr-2">Personnel ({personnel.length})</span>
                <span>{showPersonnel ? <Minus size={16} /> : <Plus size={16} />}</span>
              </button>
              {showPersonnel && (
                <div className="mb-4 border rounded-lg bg-gray-50 p-2 space-y-2">
                  <table className="w-full text-xs mb-1">
                    <thead>
                      <tr>
                        <th className="text-left py-1 px-2">Role</th>
                        <th className="text-left py-1 px-2">Hours</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {personnel.map((pers) => (
                        <tr key={pers.id}>
                          <td className="px-2 py-1">{pers.role}</td>
                          <td className="px-2 py-1">{pers.hours}</td>
                          <td className="px-2 py-1 flex gap-1">
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleEditPersonnel(pers)}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleDeletePersonnel(pers.id)}>
                              <Trash className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {editingPersonnel && (
                    <div className="flex gap-2 items-end">
                      <Select
                        value={editingPersonnel.role || ""}
                        onValueChange={v => setEditingPersonnel(p => ({ ...p!, role: v }))}
                      >
                        <SelectTrigger className="w-48 text-xs">
                          <SelectValue placeholder="Personnel role" />
                        </SelectTrigger>
                        <SelectContent>
                          {personnelRoleList.map(pers => (
                            <SelectItem key={pers.id} value={pers.role}>{pers.role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Hours"
                        type="number"
                        min={1}
                        className="w-16 text-xs"
                        value={editingPersonnel.hours ?? 1}
                        onChange={e => setEditingPersonnel(p => ({ ...p!, hours: Number(e.target.value) }))}
                      />
                      <Button variant="outline" size="sm" type="button" onClick={handleSavePersonnel}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" type="button" onClick={() => setEditingPersonnel(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                  {!editingPersonnel && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="text-xs mt-1"
                      onClick={handleAddPersonnel}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Personnel
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                className="flex items-center w-full mb-2"
                onClick={() => setShowMachines((v) => !v)}
              >
                <span className="font-semibold text-blue-700 pr-2">Machines ({machines.length})</span>
                <span>{showMachines ? <Minus size={16} /> : <Plus size={16} />}</span>
              </button>
              {showMachines && (
                <div className="mb-4 border rounded-lg bg-gray-50 p-2 space-y-2">
                  <table className="w-full text-xs mb-1">
                    <thead>
                      <tr>
                        <th className="text-left py-1 px-2">Machine</th>
                        <th className="text-left py-1 px-2">Hours</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {machines.map((mach) => (
                        <tr key={mach.id}>
                          <td className="px-2 py-1">{mach.machine}</td>
                          <td className="px-2 py-1">{mach.hours}</td>
                          <td className="px-2 py-1 flex gap-1">
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleEditMachine(mach)}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleDeleteMachine(mach.id)}>
                              <Trash className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {editingMachine && (
                    <div className="flex gap-2 items-end">
                      <Input
                        placeholder="Machine Name"
                        value={editingMachine.machine ?? ""}
                        className="text-xs"
                        onChange={e => setEditingMachine(m => ({ ...m!, machine: e.target.value }))}
                        autoFocus
                      />
                      <Input
                        placeholder="Hours"
                        type="number"
                        min={1}
                        className="w-16 text-xs"
                        value={editingMachine.hours ?? 1}
                        onChange={e => setEditingMachine(m => ({ ...m!, hours: Number(e.target.value) }))}
                      />
                      <Button variant="outline" size="sm" type="button" onClick={handleSaveMachine}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" type="button" onClick={() => setEditingMachine(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                  {!editingMachine && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="text-xs mt-1"
                      onClick={handleAddMachine}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Machine
                    </Button>
                  )}
                </div>
              )}
            </div>
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
