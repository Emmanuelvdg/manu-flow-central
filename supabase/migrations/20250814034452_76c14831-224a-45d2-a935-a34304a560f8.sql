-- Temporarily allow authenticated users to manage fx_settings until proper authentication is implemented
DROP POLICY IF EXISTS "Admins can manage fx_settings" ON public.fx_settings;
DROP POLICY IF EXISTS "Admins can manage fx_rates" ON public.fx_rates;

-- Create new policies that allow authenticated users to manage FX settings
CREATE POLICY "Authenticated users can manage fx_settings" 
ON public.fx_settings 
FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage fx_rates" 
ON public.fx_rates 
FOR ALL 
USING (auth.role() = 'authenticated');