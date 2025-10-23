-- Add columns for domestic financing documents
ALTER TABLE public.financing_applications
ADD COLUMN IF NOT EXISTS deed_of_establishment text,
ADD COLUMN IF NOT EXISTS id_cards_management text,
ADD COLUMN IF NOT EXISTS business_licenses text,
ADD COLUMN IF NOT EXISTS financial_statements text,
ADD COLUMN IF NOT EXISTS bank_statements text;