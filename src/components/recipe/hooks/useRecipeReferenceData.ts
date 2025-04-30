
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Material } from '@/types/material';

export const useRecipeReferenceData = (open: boolean) => {
  const [productList, setProductList] = useState<any[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [personnelRoleList, setPersonnelRoleList] = useState<any[]>([]);
  const [routingStagesList, setRoutingStagesList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

      // Load routing stages
      const { data: routingData } = await supabase.from('routing_stages').select('*');
      if (routingData) {
        setRoutingStagesList(routingData);
      }
    } catch (error) {
      console.error('Error fetching reference data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    productList,
    materialList,
    personnelRoleList,
    routingStagesList,
    loading
  };
};
