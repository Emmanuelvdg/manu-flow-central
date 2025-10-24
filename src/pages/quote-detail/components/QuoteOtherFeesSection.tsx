import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
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

      <div className="border rounded">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80%]">Description</TableHead>
              <TableHead className="w-[20%]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {otherFees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                  No fees or services added yet
                </TableCell>
              </TableRow>
            ) : (
              <>
                {otherFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="align-top">
                      <Textarea
                        placeholder="e.g., Research and Design, Consultation Fee"
                        value={fee.description}
                        onChange={(e) => handleUpdateFee(fee.id!, "description", e.target.value)}
                        className="min-h-[60px] w-full"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{getCurrencySymbol(currency)}</span>
                            <Input
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
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>

        <div className="p-4 space-y-4 border-t">
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
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-8">
                  <span className="font-medium">Subtotal:</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span>{getCurrencySymbol(currency)}</span>
                      <input
                        type="number"
                        className="w-32 rounded border p-2 text-right bg-gray-100"
                        value={subtotal.toFixed(2)}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="text-right">
                      <CurrencyDisplay amount={subtotal} currency={currency} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
