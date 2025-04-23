
import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .order('name');

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(product => ({
        id: product.id,
        name: product.name
      }));
    }

    // Fallback to mock data if no database results
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
    const { data, error } = await supabase
      .from('materials')
      .select('id, name, unit')
      .order('name');

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map(material => ({
        id: material.id,
        name: material.name,
        unit: material.unit
      }));
    }

    // Fallback to mock data if no database results
    return [
      { id: "mat-001", name: "Aluminum Sheet 1mm", unit: "sqm" },
      { id: "mat-002", name: "Copper Wire 2mm", unit: "m" },
      { id: "mat-003", name: "Stainless Steel Bolt M8", unit: "pcs" },
      { id: "mat-004", name: "Rubber O-Ring 20mm", unit: "pcs" },
      { id: "mat-005", name: "Plastic Resin", unit: "kg" },
      { id: "mat-006", name: "Sticker Label", unit: "pcs" },
    ];
  } catch (error) {
    console.error("Error fetching materials:", error);
    // Fallback to mock data
    return [
      { id: "mat-001", name: "Aluminum Sheet 1mm", unit: "sqm" },
      { id: "mat-002", name: "Copper Wire 2mm", unit: "m" },
      { id: "mat-003", name: "Stainless Steel Bolt M8", unit: "pcs" },
      { id: "mat-004", name: "Rubber O-Ring 20mm", unit: "pcs" },
      { id: "mat-005", name: "Plastic Resin", unit: "kg" },
      { id: "mat-006", name: "Sticker Label", unit: "pcs" },
    ];
  }
}

// Fetch personnel roles
export async function fetchPersonnelRoles(): Promise<PersonnelRoleOption[]> {
  try {
    const { data, error } = await supabase
      .from('personnel_roles')
      .select('id, role')
      .order('role');

    if (error) throw error;

    if (data && data.length > 0) {
      return data;
    }

    // Fallback to default roles if no database results
    return [
      { id: "1", role: "Operator" },
      { id: "2", role: "Quality Control" },
      { id: "3", role: "Technician" },
      { id: "4", role: "Supervisor" },
    ];
  } catch (error) {
    console.error("Error fetching personnel roles:", error);
    // Fallback to default roles
    return [
      { id: "1", role: "Operator" },
      { id: "2", role: "Quality Control" },
      { id: "3", role: "Technician" },
      { id: "4", role: "Supervisor" },
    ];
  }
}
