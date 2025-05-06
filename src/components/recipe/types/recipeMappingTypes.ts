
export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  _isNew?: boolean;
}

export interface Personnel {
  id: string;
  role: string;
  hours: number;
  stageId?: string;
  _isNew?: boolean;
}

export interface Machine {
  id: string;
  machine: string;
  hours: number;
  stageId?: string;
  _isNew?: boolean;
}

export interface RoutingStage {
  id: string;
  stage_id: string;
  stage_name: string;
  hours: number;
  personnel?: Personnel[];
  machines?: Machine[];
  _isNew?: boolean;
}

export interface RecipeMappingFormData {
  productId: string;
  productName: string;
  name: string;
  description?: string;
  materials: Material[];
  personnel: Personnel[];
  machines: Machine[];
  routingStages: RoutingStage[];
  variantId?: string;
  totalCost?: number;
}
