
import React, { useState } from 'react';
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
import { ProductVariant, VariantType } from './types/product';
import { VariantTypesManager } from './components/VariantTypesManager';
import { ProductVariantsManager } from './components/ProductVariantsManager';

const formSchema = z.object({
  id: z.string().min(2, 'Product ID must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)), 'Must be a valid number'),
  lead_time: z.string().min(2, 'Lead time is required'),
  image: z.string().url('Must be a valid URL').or(z.literal('')).default(''),
  hasVariants: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof formSchema>;

export function AddProductForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      category: '',
      price: '',
      lead_time: '',
      image: '',
      hasVariants: false,
    },
  });
  
  const hasVariants = form.watch('hasVariants');
  const basePrice = Number(form.watch('price')) || 0;

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      // Basic product data
      const productData: any = {
        id: data.id,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        lead_time: data.lead_time,
        image: data.image || null,
        hasvariants: data.hasVariants, // Match the database column name
      };
      
      // Include variant types if hasVariants is true
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
        
        // Check if we have variants
        if (variants.length === 0) {
          toast({
            title: 'Error',
            description: 'You need to generate variants for this product',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        // Add variantTypes to productData using the correct column name
        productData.varianttypes = variantTypes;
      }
      
      // Insert the base product
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // If we have variants, insert them
      if (data.hasVariants && variants.length > 0) {
        // Add product ID to each variant
        const variantsToInsert = variants.map(v => ({
          product_id: data.id, // Match the database column name
          sku: v.sku,
          attributes: v.attributes,
          price: v.price,
          image: v.image,
          inventory: v.inventory
        }));
        
        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantsToInsert);
          
        if (variantsError) {
          toast({
            title: 'Warning',
            description: `Product created but variants failed: ${variantsError.message}`,
            variant: 'destructive',
          });
          onClose();
          return;
        }
      }

      toast({
        title: 'Success',
        description: `${data.name} has been added to the catalog.`,
      });
      onClose();
    } catch (err) {
      console.error("Error adding product:", err);
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
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input placeholder="PROD-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    field.onChange(value);
                  }}
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
            
            {variantTypes.length > 0 && (
              <ProductVariantsManager
                variantTypes={variantTypes}
                variants={variants}
                onVariantsChange={setVariants}
                basePrice={basePrice}
                disabled={isSubmitting}
              />
            )}
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
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
