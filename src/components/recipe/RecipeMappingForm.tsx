
import React, { useEffect, useState } from "react";
import { RecipeProductSelect } from "./RecipeProductSelect";
import { RecipeMaterialsSection } from "./RecipeMaterialsSection";
import { RecipePersonnelSection } from "./RecipePersonnelSection";
import { RecipeMachinesSection } from "./RecipeMachinesSection";
import { useRecipeMappingForm } from "./hooks/useRecipeMappingForm";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { RecipeVariantSection } from "./form/RecipeVariantSection";
import { RecipeBasicInfoSection } from "./form/RecipeBasicInfoSection";
import { RecipeCustomProductDisplay } from "./form/RecipeCustomProductDisplay";
import { RecipeFormActions } from "./form/RecipeFormActions";
import { RecipeFormProps } from "./form/RecipeFormTypes";

export default function RecipeMappingForm(props: RecipeFormProps) {
  const form = useRecipeMappingForm(
    props.open, 
    props.initialRecipe, 
    props.onSuccess, 
    props.onClose, 
    props.customProduct,
    props.returnToQuote
  );
  
  const [productVariants, setProductVariants] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const location = useLocation();
  
  // Set initial form values for a custom product
  useEffect(() => {
    if (props.customProduct && props.customProduct.name) {
      // For custom products, we set name but leave productId empty
      form.setName(`Recipe for ${props.customProduct.name}`);
    }
  }, [props.customProduct]);

  // Load variants when product changes
  useEffect(() => {
    if (!form.productId) {
      setProductVariants([]);
      setSelectedVariantId("");
      return;
    }
    
    const loadVariants = async () => {
      try {
        // First check if product has variants
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('hasvariants')
          .eq('id', form.productId)
          .single();
          
        if (productError || !product?.hasvariants) {
          setProductVariants([]);
          setSelectedVariantId("");
          return;
        }
        
        // Load variants for the product
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', form.productId);
          
        if (!error && data && data.length > 0) {
          setProductVariants(data);
          
          // If we have an initial recipe with variantId, select it
          if (props.initialRecipe?.variantId) {
            setSelectedVariantId(props.initialRecipe.variantId);
          }
        } else {
          setProductVariants([]);
          setSelectedVariantId("");
        }
      } catch (err) {
        console.error("Error loading product variants:", err);
        setProductVariants([]);
      }
    };
    
    loadVariants();
  }, [form.productId, props.initialRecipe?.variantId]);
  
  // Update form's variantId when selection changes
  useEffect(() => {
    form.setVariantId(selectedVariantId);
  }, [selectedVariantId]);

  // Create wrapper functions to fix the function signature issues
  const handleSaveMaterial = () => {
    if (form.editingMaterial) {
      form.handleSaveMaterial(form.editingMaterial);
    }
  };

  const handleSavePersonnel = () => {
    if (form.editingPersonnel) {
      form.handleSavePersonnel(form.editingPersonnel);
    }
  };

  const handleSaveMachine = () => {
    if (form.editingMachine) {
      form.handleSaveMachine(form.editingMachine);
    }
  };

  return (
    <form onSubmit={form.handleSubmit} className="space-y-3">
      {!props.customProduct ? (
        <RecipeProductSelect
          productList={form.productList}
          productId={form.productId}
          onProductChange={form.handleProductChange}
          disabled={form.isEditing || form.loading}
          loading={form.loading}
        />
      ) : (
        <RecipeCustomProductDisplay customProduct={props.customProduct} />
      )}
      
      {/* Product Variant Selection */}
      <RecipeVariantSection 
        productVariants={productVariants}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        disabled={form.loading}
        showVariantSection={productVariants.length > 0 && !props.customProduct}
      />
      
      <RecipeBasicInfoSection
        name={form.name}
        description={form.description}
        setName={form.setName}
        setDescription={form.setDescription}
        disabled={form.loading}
      />
      
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
          handleSaveMaterial={handleSaveMaterial}
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
          handleSavePersonnel={handleSavePersonnel}
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
          handleSaveMachine={handleSaveMachine}
          handleDeleteMachine={form.handleDeleteMachine}
          disabled={form.loading}
        />
      </div>
      
      <RecipeFormActions 
        onClose={props.onClose}
        loading={form.loading}
        isEditing={form.isEditing}
      />
    </form>
  )
}
