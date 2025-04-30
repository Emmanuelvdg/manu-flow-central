
import { useState } from "react";
import type { Personnel } from "../types/recipeMappingTypes";

export function usePersonnelManagement() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Partial<Personnel> | null>(null);

  const handleAddPersonnel = () => {
    setEditingPersonnel({
      id: `temp-${Date.now()}`,
      role: '',
      hours: 1,
      _isNew: true,
    });
    setShowPersonnel(true);
  };

  const handleEditPersonnel = (person: Personnel) => {
    setEditingPersonnel({ ...person });
    setShowPersonnel(true);
  };

  const handleSavePersonnel = () => {
    if (!editingPersonnel || !editingPersonnel.role) return;
    
    const updatedPersonnel = {
      id: editingPersonnel.id || `temp-${Date.now()}`,
      role: editingPersonnel.role,
      hours: editingPersonnel.hours || 1
    } as Personnel;
    
    if (editingPersonnel._isNew) {
      setPersonnel([...personnel, updatedPersonnel]);
    } else {
      setPersonnel(
        personnel.map(p => p.id === updatedPersonnel.id ? updatedPersonnel : p)
      );
    }
    
    setEditingPersonnel(null);
  };

  const handleDeletePersonnel = (id: string) => {
    setPersonnel(personnel.filter(p => p.id !== id));
  };

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
