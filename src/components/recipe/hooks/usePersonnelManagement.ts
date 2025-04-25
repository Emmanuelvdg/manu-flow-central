
import { useState } from "react";
import type { Personnel } from "../types/recipeMappingTypes";

export function usePersonnelManagement() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Partial<Personnel> | null>(null);

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

  return {
    personnel,
    setPersonnel,
    showPersonnel,
    setShowPersonnel,
    editingPersonnel,
    setEditingPersonnel,
    handleAddPersonnel,
    handleEditPersonnel,
    handleSavePersonnel,
    handleDeletePersonnel
  };
}
