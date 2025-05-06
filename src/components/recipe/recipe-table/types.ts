
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
  stageId?: string;
}

export interface Machine {
  id: string;
  machine: string;
  hours: number;
  stageId?: string;
}

export interface RoutingStage {
  id: string;
  stage_id: string;
  stage_name: string;
  hours: number;
  personnel?: Personnel[];
  machines?: Machine[];
}

export interface MaterialCost {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  costPerUnit: number;
}

export interface RecipeFullTableProps {
  materials: Material[];
  routingStages: RoutingStage[];
  materialCosts?: {
    individualCosts: MaterialCost[];
    totalCost: number;
  };
}
