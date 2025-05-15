
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
  cost_per_hour?: number;
  stageId?: string;
  personnel_id?: string;
}

export interface Machine {
  id: string;
  machine: string;
  hours: number;
  cost_per_hour?: number;
  stageId?: string;
  machine_id?: string;
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
  quantity?: number;
  setQuantity?: React.Dispatch<React.SetStateAction<number>>;
  onCostUpdated?: (cost: number) => void;
}

export interface RecipeTableFiltersProps {
  showPersonnel: boolean;
  showMachines: boolean;
  showMaterials: boolean;
  setFilters: React.Dispatch<React.SetStateAction<{
    showPersonnel: boolean;
    showMachines: boolean;
    showMaterials: boolean;
  }>>;
  quantity: number;
  setQuantity?: React.Dispatch<React.SetStateAction<number>>;
}

export interface PersonnelRowProps {
  personnel: Personnel;
  quantity: number;
}

export interface MachineRowProps {
  machine: Machine;
  quantity: number;
}

export interface StageGroupRowsProps {
  routingStages: RoutingStage[];
  quantity: number;
}
