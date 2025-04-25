
import { useState } from "react";
import type { Material } from "../types/recipeMappingTypes";

export function useMaterialsManagement() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showMaterials, setShowMaterials] = useState(true);
  const [editingMaterial, setEditingMaterial] = useState<Partial<Material> | null>(null);

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

  return {
    materials,
    setMaterials,
    showMaterials,
    setShowMaterials,
    editingMaterial,
    setEditingMaterial,
    handleAddMaterial,
    handleEditMaterial,
    handleSaveMaterial,
    handleDeleteMaterial
  };
}
