
import { useState, useEffect } from "react";
import { fetchProducts, fetchMaterials, fetchPersonnelRoles } from "../recipeDataUtils";
import { useToast } from "@/components/ui/use-toast";
import type { ProductOption, MaterialOption, PersonnelRoleOption } from "../recipeDataUtils";

export function useRecipeReferenceData(open: boolean) {
  const { toast } = useToast();
  const [productList, setProductList] = useState<ProductOption[]>([]);
  const [materialList, setMaterialList] = useState<MaterialOption[]>([]);
  const [personnelRoleList, setPersonnelRoleList] = useState<PersonnelRoleOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        const [products, materials, personnelRoles] = await Promise.all([
          fetchProducts(),
          fetchMaterials(),
          fetchPersonnelRoles()
        ]);
        
        setProductList(products);
        setMaterialList(materials);
        setPersonnelRoleList(personnelRoles);
        setDataLoaded(true);
        
        console.log("Loaded products:", products);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load products and materials. Using fallback data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [open, toast]);

  return {
    productList,
    materialList,
    personnelRoleList,
    loading,
    dataLoaded
  };
}
