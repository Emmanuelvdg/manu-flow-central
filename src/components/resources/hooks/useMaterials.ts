
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Material } from "@/types/material";
import { fetchMaterials } from "@/components/recipe/recipeDataUtils";
import { useState, useEffect } from "react";

export const useMaterials = () => {
  const queryClient = useQueryClient();
  const [materials, setMaterials] = useState<Material[]>([]);
  
  // Fetch materials from Supabase
  const { data: dbMaterials = [], isLoading, error } = useQuery({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
  });

  // Sync 'materials' state when DB loads
  useEffect(() => {
    if (dbMaterials && dbMaterials.length > 0) {
      const formattedMaterials: Material[] = dbMaterials.map((m) => ({
        id: m.id,
        name: m.name,
        unit: m.unit,
        category: (m as any).category || "",
        status: (m as any).status || "Active",
        vendor: (m as any).vendor || "",
        batches: [],
        stock: 0,
        costPerUnit: 0
      }));
      setMaterials(formattedMaterials);
    }
  }, [dbMaterials]);

  return {
    materials,
    setMaterials,
    isLoading,
    error,
    queryClient
  };
};
