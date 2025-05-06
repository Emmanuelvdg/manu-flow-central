
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import RecipeMappingForm from "./RecipeMappingForm";
import type { CustomProduct } from "@/pages/quote-detail/components/custom-product/types";
import type { RecipeFormProps } from "./form/RecipeFormTypes";

export default function RecipeMappingModal(props: RecipeFormProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
