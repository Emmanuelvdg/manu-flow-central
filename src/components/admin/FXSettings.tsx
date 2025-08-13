import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';
import { useFXSettings } from '@/hooks/useFXSettings';
import { Badge } from '@/components/ui/badge';

export const FXSettings = () => {
  const { settings, rates, loading, updateBaseCurrency, addRate } = useFXSettings();
  const [newBaseCurrency, setNewBaseCurrency] = useState(settings?.base_currency || 'USD');
  const [newRate, setNewRate] = useState({
    fromCurrency: '',
    toCurrency: '',
    rate: '',
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  const currencies = ['USD', 'EUR', 'IDR'];

  const handleBaseCurrencyUpdate = async () => {
    await updateBaseCurrency(newBaseCurrency);
  };

  const handleAddRate = async () => {
    if (newRate.fromCurrency && newRate.toCurrency && newRate.rate && newRate.effectiveDate) {
      await addRate(
        newRate.fromCurrency,
        newRate.toCurrency,
        parseFloat(newRate.rate),
        newRate.effectiveDate
      );
      setNewRate({
        fromCurrency: '',
        toCurrency: '',
        rate: '',
        effectiveDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat().format(amount);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading FX settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Base Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Base Currency Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseCurrency">System Base Currency</Label>
            <div className="flex gap-2">
              <Select value={newBaseCurrency} onValueChange={setNewBaseCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleBaseCurrencyUpdate}>
                Update Base Currency
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This is the base currency for all financial reporting and P&L calculations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rates Management */}
      <Card>
        <CardHeader>
          <CardTitle>Exchange Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Rate */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-4">Add New Exchange Rate</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>From Currency</Label>
                <Select value={newRate.fromCurrency} onValueChange={(value) => 
                  setNewRate(prev => ({ ...prev, fromCurrency: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>To Currency</Label>
                <Select value={newRate.toCurrency} onValueChange={(value) => 
                  setNewRate(prev => ({ ...prev, toCurrency: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Exchange Rate</Label>
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="1.234567"
                  value={newRate.rate}
                  onChange={(e) => setNewRate(prev => ({ ...prev, rate: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={newRate.effectiveDate}
                  onChange={(e) => setNewRate(prev => ({ ...prev, effectiveDate: e.target.value }))}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAddRate} 
              className="mt-4"
              disabled={!newRate.fromCurrency || !newRate.toCurrency || !newRate.rate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rate
            </Button>
          </div>

          <Separator />

          {/* Current Rates */}
          <div>
            <h4 className="font-medium mb-4">Current Exchange Rates</h4>
            {rates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No exchange rates configured yet.
              </p>
            ) : (
              <div className="space-y-2">
                {rates.map((rate) => (
                  <div 
                    key={rate.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono">
                        {rate.from_currency} → {rate.to_currency}
                      </Badge>
                      <span className="font-medium">
                        {formatCurrency(rate.rate)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Effective: {new Date(rate.effective_date).toLocaleDateString()}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};