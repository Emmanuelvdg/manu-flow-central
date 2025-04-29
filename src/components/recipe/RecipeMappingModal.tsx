
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import RecipeMappingForm from "./RecipeMappingForm";
import type { CustomProduct } from "@/pages/quote-detail/components/CustomProductInput";

interface RecipeMappingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRecipe?: any;
  customProduct?: CustomProduct;
  returnToQuote?: boolean;
}

export default function RecipeMappingModal(props: RecipeMappingModalProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>
            {props.initialRecipe ? "Edit Recipe Mapping" : "Create Recipe Mapping"}
          </DialogTitle>
          <DialogDescription>
            Connect a recipe to a product by selecting a product and adding recipe, materials, personnel & machine details.
          </DialogDescription>
        </DialogHeader>
        <RecipeMappingForm {...props} />
      </DialogContent>
    </Dialog>
  );
}
