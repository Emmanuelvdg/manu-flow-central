
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductVariant, VariantType } from './types/product';
import { VariantTypesManager } from './components/VariantTypesManager';
import { ProductVariantsManager } from './components/ProductVariantsManager';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)), 'Must be a valid number'),
  lead_time: z.string().min(2, 'Lead time is required'),
  image: z.string().url('Must be a valid URL').or(z.literal('')).default(''),
  hasVariants: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof formSchema>;

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
}

export function EditProductForm({ product, onClose }: EditProductFormProps) {
  const { toast } = useToast();
  const [variantTypes, setVariantTypes] = useState<VariantType[]>(
    product.variantTypes || []
  );
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingVariantsLoaded, setExistingVariantsLoaded] = useState(false);
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      category: product.category || '',
      price: product.price?.toString() || '',
      lead_time: product.lead_time || '',
      image: product.image || '',
      hasVariants: !!product.hasVariants,
    },
  });
  
  const hasVariants = form.watch('hasVariants');
  const basePrice = Number(form.watch('price')) || 0;

  // Load existing variants if product has them
  useEffect(() => {
    if (!hasVariants || existingVariantsLoaded) return;
    
    const loadVariants = async () => {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .eq('productId', product.id);
          
        if (!error && data) {
          setVariants(data);
          setExistingVariantsLoaded(true);
        } else if (error) {
          console.error('Error loading variants:', error);
        }
      } catch (err) {
        console.error('Failed to load variants:', err);
      }
    };
    
    loadVariants();
  }, [product.id, hasVariants, existingVariantsLoaded]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting product update with image URL:', data.image);
      
      // Basic product data to update
      const productData = {
        name: data.name,
        category: data.category,
        price: Number(data.price),
        lead_time: data.lead_time,
        image: data.image || null,
        hasVariants: data.hasVariants,
        updated_at: new Date().toISOString(),
      };
      
      // If product has variants, include variant types
      if (data.hasVariants) {
        // Check if we have valid variant types
        if (variantTypes.length === 0 || variantTypes.every(t => t.options.length === 0)) {
          toast({
            title: 'Error',
            description: 'You need to define at least one variant type with options',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
        
        // Include variant types in product update
        productData.variantTypes = variantTypes;
      } else {
        // Clear variant types if hasVariants is false
        productData.variantTypes = null;
      }
      
      // Update the base product
      const { data: updatedData, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id)
        .select();

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // If product has variants, update them
      if (data.hasVariants) {
        // First, remove any existing variants that are not in the current state
        const variantIds = variants.map(v => v.id);
        
        if (existingVariantsLoaded) {
          // Delete variants that are no longer in the list
          const { error: deleteError } = await supabase
            .from('product_variants')
            .delete()
            .eq('productId', product.id)
            .not('id', 'in', `(${variantIds.join(',')})`);
            
          if (deleteError) {
            console.error('Error deleting old variants:', deleteError);
          }
        }
        
        // Then upsert all current variants
        for (const variant of variants) {
          const variantData = {
            ...variant,
            productId: product.id,
          };
          
          if (variant.id?.startsWith('variant-')) {
            // This is a new variant (temporary ID), create it
            delete variantData.id;
            await supabase.from('product_variants').insert(variantData);
          } else {
            // This is an existing variant, update it
            await supabase
              .from('product_variants')
              .update(variantData)
              .eq('id', variant.id);
          }
        }
      } else if (existingVariantsLoaded) {
        // If product no longer has variants, remove all existing ones
        await supabase
          .from('product_variants')
          .delete()
          .eq('productId', product.id);
      }
      
      console.log('Product updated successfully:', updatedData);
      toast({
        title: 'Success',
        description: `${data.name} has been updated.`,
      });
      
      onClose();
    } catch (err) {
      console.error('Unexpected error during product update:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Industrial Pump XL-5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Machinery" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="4200" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lead_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Time</FormLabel>
              <FormControl>
                <Input placeholder="4 weeks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasVariants"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Product Variants</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable to create variations of this product (color, size, etc)
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

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
