import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import type { OtherFee } from "../types/quoteTypes";

interface QuoteOtherFeesSectionProps {
  otherFees: OtherFee[];
  setOtherFees: (fees: OtherFee[]) => void;
  currency: string;
}

export const QuoteOtherFeesSection: React.FC<QuoteOtherFeesSectionProps> = ({
  otherFees,
  setOtherFees,
  currency
}) => {
  const handleAddFee = () => {
    const newFee: OtherFee = {
      id: crypto.randomUUID(),
      description: "",
      amount: 0
    };
    setOtherFees([...otherFees, newFee]);
  };

  const handleRemoveFee = (id: string) => {
    setOtherFees(otherFees.filter(fee => fee.id !== id));
  };

  const handleUpdateFee = (id: string, field: keyof OtherFee, value: string | number) => {
    setOtherFees(
      otherFees.map(fee =>
        fee.id === id ? { ...fee, [field]: value } : fee
      )
    );
  };

  const subtotal = otherFees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);

  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CNY: "¥",
      INR: "₹"
    };
    return symbols[curr] || curr;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Other Fees and Services</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm">Currency:</label>
          <span className="text-sm">{currency} ({getCurrencySymbol(currency)})</span>
        </div>
      </div>

      <div className="border rounded p-4 bg-gray-50">
        <div className="space-y-4">
          {otherFees.length === 0 ? (
            <div className="text-center py-2">
              No fees or services added yet
            </div>
          ) : (
            <div className="space-y-4">
              {otherFees.map((fee) => (
                <div
                  key={fee.id}
                  className="border rounded-lg p-4 bg-white space-y-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`description-${fee.id}`}>Description</Label>
                    <Textarea
                      id={`description-${fee.id}`}
                      placeholder="e.g., Research and Design, Consultation Fee"
                      value={fee.description}
                      onChange={(e) => handleUpdateFee(fee.id!, "description", e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`amount-${fee.id}`}>Amount</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{getCurrencySymbol(currency)}</span>
                        <Input
                          id={`amount-${fee.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={fee.amount || ""}
                          onChange={(e) => handleUpdateFee(fee.id!, "amount", parseFloat(e.target.value) || 0)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFee(fee.id!)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddFee}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another
          </Button>

          {otherFees.length > 0 && (
            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Subtotal</div>
                <div className="text-2xl font-semibold">
                  {getCurrencySymbol(currency)}{subtotal.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
