
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRecipeMappingForm } from "./hooks/useRecipeMappingForm";
import { RecipeBasicInfoSection } from "./form/RecipeBasicInfoSection";
import { RecipeFormActions } from "./form/RecipeFormActions";
import { RecipeProductSelector } from "./form/RecipeProductSelector";
import { RecipeMaterialsSection } from "./RecipeMaterialsSection";
import { RecipeRoutingStagesSection } from "./RecipeRoutingStagesSection";
import type { RecipeFormProps } from "./form/RecipeFormTypes";

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

  // Custom save handlers that integrate with the routing stage structure
  const handleSavePersonnel = () => {
    if (form.editingPersonnel) {
      form.handleSavePersonnel(form.routingStages, form.setRoutingStages);
    }
  };
  
  const handleSaveMachine = () => {
    if (form.editingMachine) {
      form.handleSaveMachine(form.routingStages, form.setRoutingStages);
    }
  };

  const handleDeletePersonnel = (id: string, stageId: string) => {
    form.handleDeletePersonnel(id, stageId, form.routingStages, form.setRoutingStages);
  };
  
  const handleDeleteMachine = (id: string, stageId: string) => {
    form.handleDeleteMachine(id, stageId, form.routingStages, form.setRoutingStages);
  };

  return (
    <form onSubmit={form.handleSubmit} className="space-y-3">
      <RecipeProductSelector
        customProduct={props.customProduct}
        productList={form.productList}
        productId={form.productId}
        handleProductChange={form.handleProductChange}
        isEditing={form.isEditing}
        loading={form.loading}
        productVariants={productVariants}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
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
          handleSaveMaterial={form.handleSaveMaterial}
          handleDeleteMaterial={form.handleDeleteMaterial}
          disabled={form.loading}
        />
        
        <RecipeRoutingStagesSection 
          routingStages={form.routingStages}
          routingStagesList={form.routingStagesList}
          showRoutingStages={true} // Always show routing stages
          setShowRoutingStages={form.setShowRoutingStages}
          editingRoutingStage={form.editingRoutingStage}
          setEditingRoutingStage={form.setEditingRoutingStage}
          handleAddRoutingStage={form.handleAddRoutingStage}
          handleEditRoutingStage={form.handleEditRoutingStage}
          handleSaveRoutingStage={form.handleSaveRoutingStage}
          handleDeleteRoutingStage={form.handleDeleteRoutingStage}
          // Personnel management
          personnelRoleList={form.personnelRoleList}
          handleAddPersonnel={form.handleAddPersonnel}
          handleEditPersonnel={form.handleEditPersonnel}
          handleSavePersonnel={handleSavePersonnel}
          handleDeletePersonnel={handleDeletePersonnel}
          editingPersonnel={form.editingPersonnel}
          setEditingPersonnel={form.setEditingPersonnel}
          // Machine management
          handleAddMachine={form.handleAddMachine}
          handleEditMachine={form.handleEditMachine}
          handleSaveMachine={handleSaveMachine}
          handleDeleteMachine={handleDeleteMachine}
          editingMachine={form.editingMachine}
          setEditingMachine={form.setEditingMachine}
          disabled={form.loading}
        />
      </div>
      
      <RecipeFormActions 
        onClose={props.onClose}
        loading={form.loading}
        isEditing={form.isEditing}
      />
    </form>
  );
}
