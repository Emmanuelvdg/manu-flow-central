import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { uploadToStorage } from "@/integrations/supabase/storage";
import { useToast } from "@/hooks/use-toast";
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
import { Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Phone number is required"),
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  deedOfEstablishment: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "Deed of Establishment is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 20MB"),
  idCardsManagement: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "ID cards are required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 20MB"),
  businessLicenses: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "Business licenses are required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 20MB"),
  financialStatements: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "Financial statements are required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 20MB"),
  bankStatements: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "Bank statements are required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 20MB"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DomesticFinancingApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DomesticFinancingApplicationDialog({
  open,
  onOpenChange,
}: DomesticFinancingApplicationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      annualRevenue: "",
      notes: "",
    },
  });

  const uploadFile = async (file: File, documentType: string): Promise<string> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const timestamp = Date.now();
    const fileName = `${user.id}/${documentType}_${timestamp}_${file.name}`;
    
    return await uploadToStorage("financing-applications", fileName, file);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit an application",
          variant: "destructive",
        });
        return;
      }

      // Upload all files
      const [
        deedOfEstablishmentUrl,
        idCardsManagementUrl,
        businessLicensesUrl,
        financialStatementsUrl,
        bankStatementsUrl,
      ] = await Promise.all([
        uploadFile(data.deedOfEstablishment[0], "deed_of_establishment"),
        uploadFile(data.idCardsManagement[0], "id_cards_management"),
        uploadFile(data.businessLicenses[0], "business_licenses"),
        uploadFile(data.financialStatements[0], "financial_statements"),
        uploadFile(data.bankStatements[0], "bank_statements"),
      ]);

      // Insert application record
      const { error } = await supabase.from("financing_applications").insert({
        user_id: user.id,
        financing_type: "domestic",
        company_name: data.companyName,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        annual_revenue: parseFloat(data.annualRevenue),
        deed_of_establishment: deedOfEstablishmentUrl,
        id_cards_management: idCardsManagementUrl,
        business_licenses: businessLicensesUrl,
        financial_statements: financialStatementsUrl,
        bank_statements: bankStatementsUrl,
        notes: data.notes,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your application has been submitted successfully",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Domestic Financing Application</DialogTitle>
          <DialogDescription>
            Please provide the following information and documents to apply for domestic financing.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
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
                name="contactName"
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
                name="contactEmail"
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
                name="contactPhone"
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
                name="annualRevenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Revenue (USD) *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Required Documents</h3>

              <FormField
                control={form.control}
                name="deedOfEstablishment"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Deed of Establishment and Amendments *</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idCardsManagement"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>ID cards (KTP) of all management + NPWP *</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessLicenses"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Business Licenses (SIUP, NIB, NPWP Company) *</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="financialStatements"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Financial Statements (2 years + 3 months) *</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.xls,.xlsx"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankStatements"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Bank Statements (24 months) *</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
