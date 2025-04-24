
import React from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  id: z.string().min(2, 'Product ID must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)), 'Must be a valid number'),
  lead_time: z.string().min(2, 'Lead time is required'),
  image: z.string().url('Must be a valid URL').or(z.literal('')).default(''),
});

type ProductFormData = z.infer<typeof formSchema>;

export function AddProductForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      category: '',
      price: '',
      lead_time: '',
      image: '',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    const { error } = await supabase
      .from('products')
      .insert({
        id: data.id,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        lead_time: data.lead_time,
        image: data.image || null,
      });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: `${data.name} has been added to the catalog.`,
    });
    onClose();
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
              <FormLabel>Price ($)</FormLabel>
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Product</Button>
        </div>
      </form>
    </Form>
  );
}
