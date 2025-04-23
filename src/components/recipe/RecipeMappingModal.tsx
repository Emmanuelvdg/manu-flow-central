
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertRecipe, updateRecipe, Recipe } from "./recipeUtils";

interface RecipeMappingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRecipe?: Recipe | null;
}

interface ProductOption {
  id: string;
  name: string;
}

const productOptions: ProductOption[] = [
  { id: "PFP_5L", name: "Packaged Food Product, 5L Canister" },
  { id: "WT", name: "Wooden Table" },
  { id: "BO00001", name: "Mechanical Subassembly BOM" },
  // Add more real products as needed, or fetch dynamically if you have products table
];

export default function RecipeMappingModal({
  open,
  onClose,
  onSuccess,
  initialRecipe,
}: RecipeMappingModalProps) {
  const [productId, setProductId] = useState(initialRecipe?.product_id || "");
  const [productName, setProductName] = useState(initialRecipe?.product_name || "");
  const [name, setName] = useState(initialRecipe?.name || "");
  const [description, setDescription] = useState(initialRecipe?.description || "");

  useEffect(() => {
    setProductId(initialRecipe?.product_id || "");
    setProductName(initialRecipe?.product_name || "");
    setName(initialRecipe?.name || "");
    setDescription(initialRecipe?.description || "");
  }, [initialRecipe, open]);

  const isEditing = Boolean(initialRecipe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !productName || !name) return;

    const payload = {
      product_id: productId,
      product_name: productName,
      name,
      description,
      materials: initialRecipe?.materials || null,
      personnel: initialRecipe?.personnel || null,
      machines: initialRecipe?.machines || null,
    };

    try {
      if (isEditing && initialRecipe) {
        await updateRecipe(initialRecipe.id, { ...payload });
      } else {
        await insertRecipe(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Failed to save recipe: " + err.message);
    }
  };

  const handleProductChange = (id: string) => {
    setProductId(id);
    const prod = productOptions.find(p => p.id === id);
    setProductName(prod ? prod.name : "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Recipe Mapping" : "Create Recipe Mapping"}</DialogTitle>
          <DialogDescription>
            Connect a recipe to a product by selecting a product and adding recipe details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Product<span className="text-red-500">*</span></label>
            <select
              className="w-full border rounded px-3 py-2"
              value={productId}
              onChange={e => handleProductChange(e.target.value)}
              required
              disabled={isEditing}
            >
              <option value="">Select product</option>
              {productOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name} ({opt.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recipe Name<span className="text-red-500">*</span></label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save" : "Create"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
