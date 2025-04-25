
import React from 'react';
import {
  Form,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Product } from './types/product';
import { useProductForm } from './hooks/useProductForm';
import { ProductFormFields } from './components/ProductFormFields';
import { VariantTypesManager } from './components/VariantTypesManager';
import { ProductVariantsManager } from './components/ProductVariantsManager';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
}

export function EditProductForm({ product, onClose }: EditProductFormProps) {
  const {
    form,
    hasVariants,
    basePrice,
    isSubmitting,
    variants,
    variantTypes,
    setVariants,
    setVariantTypes,
    onSubmit
  } = useProductForm({ product, onClose });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProductFormFields form={form} />

        {hasVariants && (
          <>
            <Separator className="my-4" />
            
            <VariantTypesManager 
              variantTypes={variantTypes}
              onChange={setVariantTypes}
              disabled={isSubmitting}
            />
            
            <ProductVariantsManager
              variantTypes={variantTypes}
              variants={variants}
              onVariantsChange={setVariants}
              basePrice={basePrice}
              disabled={isSubmitting}
            />
          </>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
