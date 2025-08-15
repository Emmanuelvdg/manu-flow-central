-- Create table for tracking unit-based progress through routing stages
CREATE TABLE public.order_stage_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_product_id UUID NOT NULL,
  stage_id TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  yet_to_start_units INTEGER NOT NULL DEFAULT 0,
  in_progress_units INTEGER NOT NULL DEFAULT 0,
  completed_units INTEGER NOT NULL DEFAULT 0,
  total_units INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT unique_order_product_stage UNIQUE (order_product_id, stage_id),
  CONSTRAINT valid_unit_totals CHECK (
    yet_to_start_units >= 0 AND 
    in_progress_units >= 0 AND 
    completed_units >= 0 AND
    yet_to_start_units + in_progress_units + completed_units <= total_units
  )
);

-- Enable RLS
ALTER TABLE public.order_stage_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow full access to order_stage_progress" 
ON public.order_stage_progress 
FOR ALL 
USING (true);

-- Create index for performance
CREATE INDEX idx_order_stage_progress_order_product_id ON public.order_stage_progress(order_product_id);

-- Create trigger for updated_at
CREATE TRIGGER update_order_stage_progress_updated_at
  BEFORE UPDATE ON public.order_stage_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();