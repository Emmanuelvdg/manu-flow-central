
import { useState } from "react";
import type { Material } from "../types/recipeMappingTypes";

export function useMaterialsManagement() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showMaterials, setShowMaterials] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Partial<Material> | null>(null);

  const handleAddMaterial = () => {
    setEditingMaterial({
      id: `temp-${Date.now()}`,
      name: '',
      quantity: 1,
      unit: '',
      _isNew: true,
    });
    setShowMaterials(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial({ ...material });
    setShowMaterials(true);
  };

  const handleSaveMaterial = () => {
    if (!editingMaterial || !editingMaterial.name) return;
    
    const updatedMaterial = {
      id: editingMaterial.id || `temp-${Date.now()}`,
      name: editingMaterial.name,
      quantity: editingMaterial.quantity || 1,
      unit: editingMaterial.unit || ''
    } as Material;
    
    if (editingMaterial._isNew) {
      setMaterials([...materials, updatedMaterial]);
    } else {
      setMaterials(
        materials.map(m => m.id === updatedMaterial.id ? updatedMaterial : m)
      );
    }
    
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

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
