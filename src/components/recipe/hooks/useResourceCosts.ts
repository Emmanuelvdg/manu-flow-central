
import { useState, useCallback } from 'react';
import type { Material } from '@/types/material';

interface MaterialWithCost extends Material {
  costPerUnit: number;
}

interface MaterialCosts {
  individualCosts: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    cost: number;
    costPerUnit: number;
  }[];
  totalCost: number;
}

export function useResourceCosts(materialList: Material[]) {
  const [materialCosts, setMaterialCosts] = useState<MaterialCosts>({
    individualCosts: [],
    totalCost: 0
  });

  const calculateMaterialsCost = useCallback((materials: any[]) => {
    if (!materials.length || !materialList.length) {
      setMaterialCosts({ individualCosts: [], totalCost: 0 });
      return;
    }

    let totalCost = 0;
    const individualCosts = materials.map(material => {
      // Find the material in the resources list
      const resourceMaterial = materialList.find(m => m.name === material.name) as MaterialWithCost;
      
      // Calculate the cost for this material
      const costPerUnit = resourceMaterial?.costPerUnit || 0;
      const cost = (material.quantity || 0) * costPerUnit;
      totalCost += cost;
      
      return {
        id: material.id,
        name: material.name,
        quantity: material.quantity || 0,
        unit: material.unit || '',
        cost,
        costPerUnit
      };
    });
    
    setMaterialCosts({
      individualCosts,
      totalCost
    });
  }, [materialList]);

  return {
    materialCosts,
    calculateMaterialsCost
  };
}
