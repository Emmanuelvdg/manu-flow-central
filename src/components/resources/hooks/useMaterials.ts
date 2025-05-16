
import { useState, useEffect } from "react";
import { Material } from "@/types/material";
import { useRawMaterialData } from "./useRawMaterialData";
import { useMaterialBatches } from "./useMaterialBatches";
import { transformMaterialWithBatches } from "../utils/materialTransforms";
import { useBatchOperations } from "./useBatchOperations";
import { useQueryClient } from "@tanstack/react-query";

export const useMaterials = () => {
  const queryClient = useQueryClient();
  const [materials, setMaterials] = useState<Material[]>([]);
  
  const { data: dbMaterials = [], isLoading, error } = useRawMaterialData();
  const { data: batches = [] } = useMaterialBatches();
  const { saveMaterialBatches } = useBatchOperations();

  useEffect(() => {
    if (!dbMaterials || dbMaterials.length === 0) {
      return;
    }
    
    console.log("Processing materials with their original properties:", dbMaterials);
    console.log("With batches:", batches);
    
    const formattedMaterials: Material[] = dbMaterials.map((m) => {
      const material = transformMaterialWithBatches(m, batches);
      console.log(`Material ${m.name} - Category: "${m.category}", Vendor: "${m.vendor}", Stock: ${material.stock}, Cost: ${material.costPerUnit}`);
      return material;
    });
    
    console.log("Formatted materials with categories, vendors, and calculated totals:", formattedMaterials);
    setMaterials(formattedMaterials);
  }, [dbMaterials, batches]);

  return {
    materials,
    setMaterials,
    isLoading,
    error,
    queryClient,
    saveMaterialBatches
  };
};
