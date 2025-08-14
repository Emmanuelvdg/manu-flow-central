import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FXSettings {
  id: string;
  base_currency: string;
  created_at: string;
  updated_at: string;
}

export interface FXRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

export const useFXSettings = () => {
  const [settings, setSettings] = useState<FXSettings | null>(null);
  const [rates, setRates] = useState<FXRate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('fx_settings' as any)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setSettings(data as unknown as FXSettings | null);
    } catch (error) {
      console.error('Error fetching FX settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch FX settings",
        variant: "destructive",
      });
    }
  };

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('fx_rates' as any)
        .select('*')
        .order('effective_date', { ascending: false });

      if (error) throw error;
      setRates((data || []) as unknown as FXRate[]);
    } catch (error) {
      console.error('Error fetching FX rates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch FX rates",
        variant: "destructive",
      });
    }
  };

  const updateBaseCurrency = async (baseCurrency: string) => {
    try {
      // Debug logging for authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('=== FX Settings Debug Info ===');
      console.log('User:', user);
      console.log('Session:', session);
      console.log('User Error:', userError);
      console.log('Session Error:', sessionError);
      console.log('Auth UID available:', !!user?.id);
      console.log('Session valid:', !!session?.access_token);
      console.log('Current settings:', settings);
      console.log('Attempting to update base currency to:', baseCurrency);
      
      if (!user) {
        throw new Error('User not authenticated. Please log in to manage FX settings.');
      }

      if (settings) {
        console.log('Updating existing settings with ID:', settings.id);
        const { error } = await supabase
          .from('fx_settings' as any)
          .update({ base_currency: baseCurrency, updated_at: new Date().toISOString() })
          .eq('id', settings.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        console.log('Creating new FX settings record');
        const { error } = await supabase
          .from('fx_settings' as any)
          .insert({ base_currency: baseCurrency });

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
      }

      await fetchSettings();
      toast({
        title: "Success",
        description: "Base currency updated successfully",
      });
    } catch (error) {
      console.error('Error updating base currency:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update base currency",
        variant: "destructive",
      });
    }
  };

  const addRate = async (fromCurrency: string, toCurrency: string, rate: number, effectiveDate: string) => {
    try {
      // Debug logging for authentication
      const { data: { user } } = await supabase.auth.getUser();
      console.log('=== Adding FX Rate Debug Info ===');
      console.log('User authenticated:', !!user);
      console.log('User ID:', user?.id);
      console.log('Adding rate:', { fromCurrency, toCurrency, rate, effectiveDate });
      
      if (!user) {
        throw new Error('User not authenticated. Please log in to manage exchange rates.');
      }

      const { error } = await supabase
        .from('fx_rates' as any)
        .insert({
          from_currency: fromCurrency,
          to_currency: toCurrency,
          rate,
          effective_date: effectiveDate
        });

      if (error) {
        console.error('Add rate error:', error);
        throw error;
      }

      await fetchRates();
      toast({
        title: "Success",
        description: "Exchange rate added successfully",
      });
    } catch (error) {
      console.error('Error adding FX rate:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add exchange rate",
        variant: "destructive",
      });
    }
  };

  const getCurrentRate = (fromCurrency: string, toCurrency: string): number | null => {
    if (fromCurrency === toCurrency) return 1;

    // Find the most recent rate for this currency pair
    const rate = rates.find(r => 
      r.from_currency === fromCurrency && 
      r.to_currency === toCurrency &&
      new Date(r.effective_date) <= new Date()
    );

    return rate ? rate.rate : null;
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number | null => {
    const rate = getCurrentRate(fromCurrency, toCurrency);
    return rate ? amount * rate : null;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSettings(), fetchRates()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    settings,
    rates,
    loading,
    updateBaseCurrency,
    addRate,
    getCurrentRate,
    convertAmount,
    refetch: () => Promise.all([fetchSettings(), fetchRates()])
  };
};