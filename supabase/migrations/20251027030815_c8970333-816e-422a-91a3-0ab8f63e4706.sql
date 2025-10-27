-- Create order_logistics table for shipping and logistics data
CREATE TABLE IF NOT EXISTS public.order_logistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  container_type TEXT CHECK (container_type IN ('20"', '40"', '40HC')),
  consol NUMERIC(10,2),
  forecast_load_date DATE,
  tgl_loading_date DATE,
  incoterms TEXT,
  qc TEXT,
  pic TEXT,
  notes TEXT,
  port TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id)
);

-- Enable Row Level Security
ALTER TABLE public.order_logistics ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can access order_logistics"
ON public.order_logistics
FOR ALL
USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_order_logistics_updated_at
BEFORE UPDATE ON public.order_logistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_order_logistics_order_id ON public.order_logistics(order_id);