import React from "react";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";

interface QuoteGrandTotalProps {
  productsTotal: number;
  otherFeesTotal: number;
  currency: string;
}

export const QuoteGrandTotal: React.FC<QuoteGrandTotalProps> = ({
  productsTotal,
  otherFeesTotal,
  currency
}) => {
  const grandTotal = productsTotal + otherFeesTotal;

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
    <div className="border rounded p-6 bg-blue-50">
      <div className="flex justify-end">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-8">
            <span className="font-semibold text-lg">Grand Total:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{getCurrencySymbol(currency)}</span>
                <input
                  type="number"
                  className="w-32 rounded border p-2 text-right bg-white font-semibold text-lg"
                  value={grandTotal.toFixed(2)}
                  readOnly
                  disabled
                />
              </div>
              <div className="text-right">
                <CurrencyDisplay amount={grandTotal} currency={currency} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
