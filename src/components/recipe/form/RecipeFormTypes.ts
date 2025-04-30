
import type { CustomProduct } from "@/pages/quote-detail/components/custom-product/types";

// Props for the main recipe form component
export interface RecipeFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRecipe?: any;
  customProduct?: CustomProduct;
  returnToQuote?: boolean;
}

// Props for the variant section component
export interface RecipeVariantSectionProps {
  productVariants: any[];
  selectedVariantId: string;
  setSelectedVariantId: (id: string) => void;
  disabled?: boolean;
  showVariantSection: boolean;
}

// Props for the basic info section component
export interface RecipeBasicInfoProps {
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  disabled?: boolean;
}

// Props for the product display component
export interface RecipeProductDisplayProps {
  customProduct: CustomProduct;
}

// Props for the materials section component
export interface RecipeMaterialsSectionProps {
  materials: any[];
  setMaterials: React.Dispatch<React.SetStateAction<any[]>>;
  materialList: any[];
  showMaterials: boolean;
  setShowMaterials: (show: boolean) => void;
  editingMaterial: any | null;
  setEditingMaterial: (m: any | null) => void;
  handleAddMaterial: () => void;
  handleEditMaterial: (m: any) => void;
  handleSaveMaterial: () => void;
  handleDeleteMaterial: (id: string) => void;
  disabled?: boolean;
}

// Props for the personnel section component
export interface RecipePersonnelSectionProps {
  personnel: any[];
  personnelRoleList: any[];
  showPersonnel: boolean;
  setShowPersonnel: (show: boolean) => void;
  editingPersonnel: any | null;
  setEditingPersonnel: (p: any | null) => void;
  handleAddPersonnel: () => void;
  handleEditPersonnel: (p: any) => void;
  handleSavePersonnel: () => void;
  handleDeletePersonnel: (id: string) => void;
  disabled?: boolean;
}

// Props for the machines section component
export interface RecipeMachinesSectionProps {
  machines: any[];
  showMachines: boolean;
  setShowMachines: (show: boolean) => void;
  editingMachine: any | null;
  setEditingMachine: (m: any | null) => void;
  handleAddMachine: () => void;
  handleEditMachine: (m: any) => void;
  handleSaveMachine: () => void;
  handleDeleteMachine: (id: string) => void;
  disabled?: boolean;
}

// Props for the routing stages section component
export interface RecipeRoutingStagesSectionProps {
  routingStages: any[];
  routingStagesList: any[];
  showRoutingStages: boolean;
  setShowRoutingStages: (show: boolean) => void;
  editingRoutingStage: any | null;
  setEditingRoutingStage: (r: any | null) => void;
  handleAddRoutingStage: () => void;
  handleEditRoutingStage: (r: any) => void;
  handleSaveRoutingStage: () => void;
  handleDeleteRoutingStage: (id: string) => void;
  disabled?: boolean;
}
