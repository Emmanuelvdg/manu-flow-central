
import { supabase } from "@/integrations/supabase/client";
import { Material } from "@/types/material";

export interface ProductOption {
  id: string;
  name: string;
}

export interface MaterialOption {
  id: string;
  name: string;
  unit: string;
}

export interface PersonnelRoleOption {
  id: string;
  role: string;
}

// Fetch products from the backend
export async function fetchProducts(): Promise<ProductOption[]> {
  try {
    // First attempt to fetch from database if available
    const { data, error } = await supabase
      .from("products")
      .select("id, name")
      .order("name");

    if (data && data.length > 0 && !error) {
      return data.map(product => ({
        id: product.id,
        name: product.name
      }));
    }

    // Fallback to mock data
    return [
      { id: "PFP_5L", name: "Packaged Food Product, 5L Canister" },
      { id: "WT", name: "Wooden Table" },
      { id: "BO00001", name: "Mechanical Subassembly BOM" },
    ];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to mock data
    return [
      { id: "PFP_5L", name: "Packaged Food Product, 5L Canister" },
      { id: "WT", name: "Wooden Table" },
      { id: "BO00001", name: "Mechanical Subassembly BOM" },
    ];
  }
}

// Fetch materials from the backend
export async function fetchMaterials(): Promise<MaterialOption[]> {
  try {
    // First attempt to fetch from database
    const { data: materialsData, error: materialsError } = await supabase
      .from("materials")
      .select("id, name, unit")
      .order("name");
    
    if (materialsData && materialsData.length > 0 && !materialsError) {
      return materialsData.map(material => ({
        id: material.id,
        name: material.name,
        unit: material.unit
      }));
    }

    // Try to fallback to materials table from Types
    // This will work if the Resources page is using the Materials component
    const mockMaterials: Material[] = [
      { id: "mat-001", name: "Aluminum Sheet 1mm", category: "Metals", unit: "sqm", status: "Active", vendor: "MetalWorks Ltd" },
      { id: "mat-002", name: "Copper Wire 2mm", category: "Metals", unit: "m", status: "Active", vendor: "ElectroSupplies Inc" },
      { id: "mat-003", name: "Stainless Steel Bolt M8", category: "Fasteners", unit: "pcs", status: "Active", vendor: "FastFix Co" },
      { id: "mat-004", name: "Rubber O-Ring 20mm", category: "Seals", unit: "pcs", status: "Active", vendor: "SealMaster" },
      { id: "mat-005", name: "Plastic Resin", category: "Raw Materials", unit: "kg", status: "Active", vendor: "PlastiCorp" },
      { id: "mat-006", name: "Sticker Label", category: "Packaging", unit: "pcs", status: "Active", vendor: "LabelMakers Inc" },
    ];
    
    return mockMaterials.map(mat => ({
      id: mat.id,
      name: mat.name,
      unit: mat.unit
    }));
  } catch (error) {
    console.error("Error fetching materials:", error);
    // Fallback to basic materials
    return [
      { id: "mat-001", name: "Plastic Resin", unit: "kg" },
      { id: "mat-002", name: "Sticker Label", unit: "pcs" },
      { id: "mat-003", name: "Aluminum Sheet", unit: "sqm" },
      { id: "mat-004", name: "Rubber O-Ring", unit: "pcs" },
    ];
  }
}

// Fetch personnel roles
export async function fetchPersonnelRoles(): Promise<PersonnelRoleOption[]> {
  try {
    // First attempt to fetch from database
    const { data, error } = await supabase
      .from("personnel_roles")
      .select("id, role")
      .order("role");

    if (data && data.length > 0 && !error) {
      return data;
    }

    // Fallback to existing recipes to extract roles
    const { data: recipesData, error: recipesError } = await supabase
      .from('recipes')
      .select('personnel')
      .not('personnel', 'is', null);

    if (recipesData && recipesData.length && !recipesError) {
      const rolesSet = new Set<string>();
      recipesData.forEach(recipe => {
        if (recipe.personnel && Array.isArray(recipe.personnel)) {
          recipe.personnel.forEach((pers: any) => {
            if (pers.role) {
              rolesSet.add(pers.role);
            }
          });
        }
      });
      
      const uniqueRoles = Array.from(rolesSet).map((role, index) => ({
        id: String(index + 1),
        role
      }));
      
      if (uniqueRoles.length > 0) {
        return uniqueRoles;
      }
    }

    // Default fallback
    return [
      { id: "1", role: "Operator" },
      { id: "2", role: "Quality Control" },
      { id: "3", role: "Technician" },
      { id: "4", role: "Supervisor" },
    ];
  } catch (error) {
    console.error("Error fetching personnel roles:", error);
    // Fallback to basic roles
    return [
      { id: "1", role: "Operator" },
      { id: "2", role: "Quality Control" },
      { id: "3", role: "Technician" },
      { id: "4", role: "Supervisor" },
    ];
  }
}
