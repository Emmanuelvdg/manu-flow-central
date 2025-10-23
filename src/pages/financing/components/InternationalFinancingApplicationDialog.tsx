import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(1, "Phone number is required"),
  annual_revenue: z.string().optional(),
  sample_transactional_doc: z.instanceof(FileList).optional(),
  historical_transactional_data: z.instanceof(FileList).optional(),
  bank_statements_sales_ledger: z.instanceof(FileList).optional(),
  identification_docs: z.instanceof(FileList).optional(),
  certificate_of_incorporation: z.instanceof(FileList).optional(),
  beneficial_owner_structure: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InternationalFinancingApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InternationalFinancingApplicationDialog = ({
  open,
  onOpenChange,
}: InternationalFinancingApplicationDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      annual_revenue: "",
    },
  });

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to upload files");
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('financing-applications')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }

    return fileName;
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to submit an application");
        return;
      }

      // Upload all files
      const uploadPromises: Array<{ key: string; promise: Promise<string | null> }> = [];
      
      const fileFields = [
        'sample_transactional_doc',
        'historical_transactional_data',
        'bank_statements_sales_ledger',
        'identification_docs',
        'certificate_of_incorporation',
        'beneficial_owner_structure',
      ] as const;

      for (const field of fileFields) {
        const fileList = values[field];
        if (fileList && fileList.length > 0) {
          uploadPromises.push({
            key: field,
            promise: uploadFile(fileList[0], field),
          });
        }
      }

      const uploadResults = await Promise.all(
        uploadPromises.map(async ({ key, promise }) => ({
          key,
          path: await promise,
        }))
      );

      const filePaths: Record<string, string> = {};
      for (const { key, path } of uploadResults) {
        if (path) {
          filePaths[key] = path;
        }
      }

      // Insert application record
      const { error } = await supabase
        .from('financing_applications')
        .insert({
          user_id: user.id,
          financing_type: 'international',
          company_name: values.company_name,
          contact_name: values.contact_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          annual_revenue: values.annual_revenue ? parseFloat(values.annual_revenue) : null,
          ...filePaths,
        });

      if (error) {
        console.error('Database error:', error);
        toast.error("Failed to submit application");
        return;
      }

      toast.success("Application submitted successfully!");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>International Financing Application</DialogTitle>
          <DialogDescription>
            Complete this form to apply for international financing. All required documents must be uploaded.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>
              
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annual_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Export/Import Revenue (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Historical Transactional Data / Documentation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Historical Transactional Data / Documentation</h3>
              
              <FormField
                control={form.control}
                name="sample_transactional_doc"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Sample Transactional Documentation</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="historical_transactional_data"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Historical Transactional Data (Last 6 Months per Buyer)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank_statements_sales_ledger"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Bank Statements & Sales Ledger Data (Last 6 Months)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* KYC Documentation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">KYC Documentation</h3>
              
              <FormField
                control={form.control}
                name="identification_docs"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Identification Documentation for Relevant Stakeholders</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificate_of_incorporation"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Certificate of Incorporation</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="beneficial_owner_structure"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Ultimate Beneficial Owner(s) Structure</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
