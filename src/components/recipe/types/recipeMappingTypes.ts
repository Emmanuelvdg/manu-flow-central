
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
}
