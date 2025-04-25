
export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Personnel {
  id: string;
  role: string;
  hours: number;
}

export interface Machine {
  id: string;
  machine: string;
  hours: number;
}

export interface RecipeMappingFormData {
  productId: string;
  productName: string;
  name: string;
  description: string;
  materials: Material[];
  personnel: Personnel[];
  machines: Machine[];
  variantId?: string; // Adding support for variant-specific recipes
}

export interface ProductVariant {
  id: string;
  productId: string;
  attributes: Record<string, string>;
  sku: string;
  price?: number;
  image?: string;
  inventory?: number;
}

export interface VariantType {
  id: string;
  name: string;
  options: string[];
}
