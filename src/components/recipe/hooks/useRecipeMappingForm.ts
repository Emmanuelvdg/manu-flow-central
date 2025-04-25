
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Material } from '@/types/material';
import { parseJsonField } from '@/components/dashboard/utils/productUtils';

export const useRecipeMappingForm = (open: boolean, initialRecipe: any, onSuccess: () => void, onClose: () => void) => {
  const [productId, setProductId] = useState<string>(initialRecipe?.product_id || '');
  const [name, setName] = useState<string>(initialRecipe?.name || '');
  const [description, setDescription] = useState<string>(initialRecipe?.description || '');
  const [variantId, setVariantId] = useState<string>(initialRecipe?.variantId || '');
  const [productList, setProductList] = useState<any[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [personnelRoleList, setPersonnelRoleList] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>(initialRecipe?.materials || []);
  const [personnel, setPersonnel] = useState<any[]>(initialRecipe?.personnel || []);
  const [machines, setMachines] = useState<any[]>(initialRecipe?.machines || []);
  const [showMaterials, setShowMaterials] = useState<boolean>(false);
  const [showPersonnel, setShowPersonnel] = useState<boolean>(false);
  const [showMachines, setShowMachines] = useState<boolean>(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
  const [editingPersonnel, setEditingPersonnel] = useState<any | null>(null);
  const [editingMachine, setEditingMachine] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isEditing = !!initialRecipe?.id;

  // Load reference data when the form opens
  useEffect(() => {
    if (open) {
      fetchReferenceData();
    }
  }, [open]);

  // Fetch reference data from Supabase
  const fetchReferenceData = async () => {
    setLoading(true);
    try {
      // Load products
      const { data: productsData } = await supabase.from('products').select('*');
      if (productsData) {
        setProductList(productsData.map(p => ({ id: p.id, name: p.name })));
      }

      // Load materials
      const { data: materialsData } = await supabase.from('materials').select('*');
      if (materialsData) {
        // Transform the materials data to match our Material type
        const transformedMaterials = materialsData.map(m => ({
          id: m.id,
          name: m.name,
          category: m.category || '',
          unit: m.unit,
          status: m.status || '',
          vendor: m.vendor || '',
          stock: 0, // Default value
          costPerUnit: 0, // Default value
        }));
        setMaterialList(transformedMaterials);
      }

      // Load personnel roles
      const { data: rolesData } = await supabase.from('personnel_roles').select('*');
      if (rolesData) {
        setPersonnelRoleList(rolesData);
      }
    } catch (error) {
      console.error('Error fetching reference data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !name) return;

    setLoading(true);
    try {
      const recipeData = {
        product_id: productId,
        product_name: productList.find(p => p.id === productId)?.name || '',
        name,
        description,
        materials,
        personnel,
        machines,
        ...(variantId ? { variantId } : {})
      };

      if (isEditing) {
        await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', initialRecipe.id);
      } else {
        await supabase.from('recipes').insert([recipeData]);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  // Functions to handle material operations
  const handleAddMaterial = () => {
    setEditingMaterial({
      id: `temp-${Date.now()}`,
      material_id: '',
      quantity: 1,
      unit: '',
      isNew: true,
    });
    setShowMaterials(true);
  };

  const handleEditMaterial = (material: any) => {
    setEditingMaterial({ ...material });
  };

  const handleSaveMaterial = (material: any) => {
    if (material.isNew) {
      setMaterials([...materials, { ...material, isNew: undefined }]);
    } else {
      setMaterials(materials.map(m => m.id === material.id ? { ...material } : m));
    }
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  // Functions to handle personnel operations
  const handleAddPersonnel = () => {
    setEditingPersonnel({
      id: `temp-${Date.now()}`,
      role: '',
      quantity: 1,
      hours: 1,
      isNew: true,
    });
    setShowPersonnel(true);
  };

  const handleEditPersonnel = (personnelItem: any) => {
    setEditingPersonnel({ ...personnelItem });
  };

  const handleSavePersonnel = (personnelItem: any) => {
    if (personnelItem.isNew) {
      setPersonnel([...personnel, { ...personnelItem, isNew: undefined }]);
    } else {
      setPersonnel(personnel.map(p => p.id === personnelItem.id ? { ...personnelItem } : p));
    }
    setEditingPersonnel(null);
  };

  const handleDeletePersonnel = (id: string) => {
    setPersonnel(personnel.filter(p => p.id !== id));
  };

  // Functions to handle machine operations
  const handleAddMachine = () => {
    setEditingMachine({
      id: `temp-${Date.now()}`,
      name: '',
      setup_time: 0,
      run_time: 0,
      isNew: true,
    });
    setShowMachines(true);
  };

  const handleEditMachine = (machine: any) => {
    setEditingMachine({ ...machine });
  };

  const handleSaveMachine = (machine: any) => {
    if (machine.isNew) {
      setMachines([...machines, { ...machine, isNew: undefined }]);
    } else {
      setMachines(machines.map(m => m.id === machine.id ? { ...machine } : m));
    }
    setEditingMachine(null);
  };

  const handleDeleteMachine = (id: string) => {
    setMachines(machines.filter(m => m.id !== id));
  };

  // Handle product selection
  const handleProductChange = (productId: string) => {
    setProductId(productId);
    // Reset variant selection when product changes
    setVariantId('');
  };

  return {
    productId,
    name,
    description,
    variantId,
    productList,
    materialList,
    personnelRoleList,
    materials,
    personnel,
    machines,
    showMaterials,
    showPersonnel,
    showMachines,
    editingMaterial,
    editingPersonnel,
    editingMachine,
    loading,
    isEditing,
    setProductId,
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
    handleDeleteMachine,
  };
};
