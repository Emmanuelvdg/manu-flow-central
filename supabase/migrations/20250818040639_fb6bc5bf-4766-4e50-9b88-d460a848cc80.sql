-- Remove old percentage-based progress columns from order_products table
-- These are being replaced by the new unit-based tracking in order_stage_progress table

ALTER TABLE order_products 
DROP COLUMN IF EXISTS materials_progress,
DROP COLUMN IF EXISTS personnel_progress,
DROP COLUMN IF EXISTS machines_progress;