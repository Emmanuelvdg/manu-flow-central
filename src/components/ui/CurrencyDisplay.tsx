import React from 'react';
import { useFXSettings } from '@/hooks/useFXSettings';
import { Badge } from '@/components/ui/badge';

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  showBaseAmount?: boolean;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency,
  showBaseAmount = true,
  className = ""
}) => {
  const { settings, convertAmount } = useFXSettings();

  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const baseCurrency = settings?.base_currency || 'USD';
  const baseAmount = currency !== baseCurrency ? convertAmount(amount, currency, baseCurrency) : amount;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="font-medium">
        {formatCurrency(amount, currency)}
      </div>
      {showBaseAmount && currency !== baseCurrency && baseAmount !== null && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{formatCurrency(baseAmount, baseCurrency)}</span>
          <Badge variant="outline" className="text-xs">
            Base Currency
          </Badge>
        </div>
      )}
    </div>
  );
};