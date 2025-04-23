
import React from "react";
import type { RFQProductItem } from "./quoteDetailUtils";

interface QuoteProductsSectionProps {
  rfqProducts: RFQProductItem[] | undefined;
  setRFQProducts: (items: RFQProductItem[] | undefined) => void;
  products: string;
  setProducts: (val: string) => void;
}

export const QuoteDetailProductsSection: React.FC<QuoteProductsSectionProps> = ({
  rfqProducts,
  setRFQProducts,
  products,
  setProducts,
}) => {
  const handleQuantityChange = (idx: number, qty: number) => {
    if (!rfqProducts) return;
    const items = [...rfqProducts];
    items[idx] = { ...items[idx], quantity: qty };
    setRFQProducts(items);
  };

  if (rfqProducts && rfqProducts.length > 0) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">Products Requested</label>
        <ul className="border rounded p-2 bg-gray-50">
          {rfqProducts.map((prod, idx) => (
            <li key={prod.id ?? prod.name ?? idx} className="flex justify-between items-center py-1 gap-3">
              <span className="font-medium">{prod.name}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  className="w-20 rounded border p-1 text-sm"
                  value={prod.quantity ?? 1}
                  onChange={e => handleQuantityChange(idx, Math.max(1, Number(e.target.value)))}
                />
                <span className="text-xs text-gray-600">Qty</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Products Requested</label>
      <input
        type="text"
        className="w-full rounded border p-2"
        placeholder="Products"
        value={products}
        onChange={e => setProducts(e.target.value)}
      />
    </div>
  );
};
