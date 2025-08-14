-- Create fx_settings table for base currency configuration
CREATE TABLE IF NOT EXISTS public.fx_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fx_rates table for exchange rates
CREATE TABLE IF NOT EXISTS public.fx_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  effective_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.fx_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fx_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for fx_settings
CREATE POLICY "Admins can manage fx_settings" 
ON public.fx_settings 
FOR ALL 
USING (is_admin());

CREATE POLICY "Authenticated users can read fx_settings" 
ON public.fx_settings 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create RLS policies for fx_rates
CREATE POLICY "Admins can manage fx_rates" 
ON public.fx_rates 
FOR ALL 
USING (is_admin());

CREATE POLICY "Authenticated users can read fx_rates" 
ON public.fx_rates 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Add unique constraint to prevent duplicate rates for same currency pair and date
CREATE UNIQUE INDEX fx_rates_unique_rate_per_date 
ON public.fx_rates (from_currency, to_currency, effective_date);

-- Create triggers for updated_at columns
CREATE TRIGGER update_fx_settings_updated_at
  BEFORE UPDATE ON public.fx_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fx_rates_updated_at
  BEFORE UPDATE ON public.fx_rates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();