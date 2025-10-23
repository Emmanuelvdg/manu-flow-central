-- Create storage bucket for financing applications
INSERT INTO storage.buckets (id, name, public)
VALUES ('financing-applications', 'financing-applications', false)
ON CONFLICT (id) DO NOTHING;

-- Create financing applications table
CREATE TABLE IF NOT EXISTS public.financing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  financing_type TEXT NOT NULL CHECK (financing_type IN ('invoice_insurance', 'domestic', 'international')),
  
  -- Company Information
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  annual_revenue DECIMAL,
  
  -- Document URLs (stored in storage)
  sample_transactional_doc TEXT,
  historical_transactional_data TEXT,
  bank_statements_sales_ledger TEXT,
  identification_docs TEXT,
  certificate_of_incorporation TEXT,
  beneficial_owner_structure TEXT,
  
  -- Application status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.financing_applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can create their own applications"
  ON public.financing_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending applications
CREATE POLICY "Users can update their own pending applications"
  ON public.financing_applications
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.financing_applications
  FOR SELECT
  USING (public.is_admin());

-- Admins can update any application
CREATE POLICY "Admins can update any application"
  ON public.financing_applications
  FOR UPDATE
  USING (public.is_admin());

-- Create trigger for updated_at
CREATE TRIGGER set_financing_applications_updated_at
  BEFORE UPDATE ON public.financing_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Storage policies for financing applications bucket
CREATE POLICY "Users can upload their own documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'financing-applications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'financing-applications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'financing-applications' AND
    public.is_admin()
  );