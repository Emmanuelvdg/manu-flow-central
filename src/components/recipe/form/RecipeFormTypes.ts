
import type { CustomProduct } from "@/pages/quote-detail/components/custom-product/types";

export interface RecipeFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRecipe?: any;
  customProduct?: CustomProduct;
  returnToQuote?: boolean;
}

export interface RecipeVariantSectionProps {
  productVariants: any[];
  selectedVariantId: string;
  setSelectedVariantId: (id: string) => void;
  disabled?: boolean;
  showVariantSection: boolean;
}

export interface RecipeBasicInfoProps {
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  disabled?: boolean;
}

export interface RecipeProductDisplayProps {
  customProduct: CustomProduct;
}
