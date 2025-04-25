
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RecipeProductSelect } from "./RecipeProductSelect";
import { RecipeMaterialsSection } from "./RecipeMaterialsSection";
import { RecipePersonnelSection } from "./RecipePersonnelSection";
import { RecipeMachinesSection } from "./RecipeMachinesSection";
import { useRecipeMappingForm } from "./useRecipeMappingForm";

interface RecipeMappingFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialRecipe?: any;
}

export default function RecipeMappingForm(props: RecipeMappingFormProps) {
  const form = useRecipeMappingForm(props.open, props.initialRecipe, props.onSuccess, props.onClose);

  return (
    <form onSubmit={form.handleSubmit} className="space-y-3">
      <RecipeProductSelect
        productList={form.productList}
        productId={form.productId}
        onProductChange={form.handleProductChange}
        disabled={form.isEditing || form.loading}
        loading={form.loading}
      />
      <div>
        <label className="block text-sm font-medium mb-1">Recipe Name<span className="text-red-500">*</span></label>
        <Input 
          value={form.name} 
          onChange={e => form.setName(e.target.value)} 
          required 
          disabled={form.loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input 
          value={form.description} 
          onChange={e => form.setDescription(e.target.value)}
          disabled={form.loading}
        />
      </div>
      <div className="pt-2">
        <RecipeMaterialsSection
          materials={form.materials}
          setMaterials={form.setMaterials}
          materialList={form.materialList}
          showMaterials={form.showMaterials}
          setShowMaterials={form.setShowMaterials}
          editingMaterial={form.editingMaterial}
          setEditingMaterial={form.setEditingMaterial}
          handleAddMaterial={form.handleAddMaterial}
          handleEditMaterial={form.handleEditMaterial}
          handleSaveMaterial={form.handleSaveMaterial}
          handleDeleteMaterial={form.handleDeleteMaterial}
          disabled={form.loading}
        />
        <RecipePersonnelSection
          personnel={form.personnel}
          personnelRoleList={form.personnelRoleList}
          showPersonnel={form.showPersonnel}
          setShowPersonnel={form.setShowPersonnel}
          editingPersonnel={form.editingPersonnel}
          setEditingPersonnel={form.setEditingPersonnel}
          handleAddPersonnel={form.handleAddPersonnel}
          handleEditPersonnel={form.handleEditPersonnel}
          handleSavePersonnel={form.handleSavePersonnel}
          handleDeletePersonnel={form.handleDeletePersonnel}
          disabled={form.loading}
        />
        <RecipeMachinesSection
          machines={form.machines}
          showMachines={form.showMachines}
          setShowMachines={form.setShowMachines}
          editingMachine={form.editingMachine}
          setEditingMachine={form.setEditingMachine}
          handleAddMachine={form.handleAddMachine}
          handleEditMachine={form.handleEditMachine}
          handleSaveMachine={form.handleSaveMachine}
          handleDeleteMachine={form.handleDeleteMachine}
          disabled={form.loading}
        />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="submit" disabled={form.loading}>
          {form.loading ? "Saving..." : form.isEditing ? "Save" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={props.onClose} disabled={form.loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
