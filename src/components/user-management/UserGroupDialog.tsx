
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

interface UserGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userGroup?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export const UserGroupDialog = ({ 
  open, 
  onOpenChange,
  onSuccess,
  userGroup 
}: UserGroupDialogProps) => {
  const { toast } = useToast();
  const isEditMode = !!userGroup;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userGroup?.name || "",
      description: userGroup?.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditMode) {
        // Update existing user group
        const { error } = await supabase
          .from('user_groups')
          .update({
            name: values.name,
            description: values.description || null
          })
          .eq('id', userGroup.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "User group updated successfully",
        });
      } else {
        // Create new user group
        const { error } = await supabase
          .from('user_groups')
          .insert({
            name: values.name,
            description: values.description || null
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "User group created successfully",
        });
      }
      
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Error saving user group:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user group",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit User Group" : "Create User Group"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter group description" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="px-0 pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
