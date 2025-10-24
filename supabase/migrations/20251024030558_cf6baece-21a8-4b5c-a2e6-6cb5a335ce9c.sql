-- Add other_fees column to quotes table to store additional service charges
ALTER TABLE quotes ADD COLUMN other_fees JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN quotes.other_fees IS 'Array of additional fees and services with description and amount';
