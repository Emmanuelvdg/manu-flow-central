import { useFXSettings } from './useFXSettings';

export const useCurrencyConversion = () => {
  const { settings, getCurrentRate, convertAmount } = useFXSettings();

  const getConversionData = (amount: number, currency: string) => {
    const baseCurrency = settings?.base_currency || 'USD';
    const exchangeRate = getCurrentRate(currency, baseCurrency);
    const baseTotal = convertAmount(amount, currency, baseCurrency);
    const conversionDate = new Date().toISOString();

    return {
      originalCurrency: currency,
      originalAmount: amount,
      baseCurrency,
      baseAmount: baseTotal,
      exchangeRate,
      conversionDate
    };
  };

  return {
    getConversionData,
    baseCurrency: settings?.base_currency || 'USD'
  };
};