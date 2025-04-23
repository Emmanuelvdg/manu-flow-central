
import React from "react";
import type { RFQProductItem } from "./quoteDetailUtils";

interface QuoteDetailProductsSectionProps {
  products: RFQProductItem[];
  setProducts: (items: RFQProductItem[]) => void;
  total: number;
  setTotal: (total: number) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

export const QuoteDetailProductsSection: React.FC<QuoteDetailProductsSectionProps> = ({
  products,
  setProducts,
  total,
  setTotal,
  currency,
  setCurrency,
}) => {
  const handleQuantityChange = (idx: number, qty: number) => {
    const items = [...products];
    items[idx] = { ...items[idx], quantity: qty };
    setProducts(items);
  };

  const handleProductNameChange = (idx: number, name: string) => {
    const items = [...products];
    items[idx] = { ...items[idx], name };
    setProducts(items);
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: "", quantity: 1 }]);
  };

  const handleRemoveProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Products</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm">Currency:</label>
          <select
            className="border rounded p-1 text-sm"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      <div className="border rounded p-4 bg-gray-50">
        {products.length === 0 ? (
          <div className="text-center py-2">No products added yet</div>
        ) : (
          <ul className="space-y-2">
            {products.map((prod, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  className="flex-1 rounded border p-2"
                  placeholder="Product name"
                  value={prod.name}
                  onChange={(e) => handleProductNameChange(idx, e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    className="w-20 rounded border p-2"
                    value={prod.quantity ?? 1}
                    onChange={(e) => handleQuantityChange(idx, Math.max(1, Number(e.target.value)))}
                  />
                  <button
                    type="button"
                    className="text-red-500 text-sm"
                    onClick={() => handleRemoveProduct(idx)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="mt-4 text-sm text-blue-600"
          onClick={handleAddProduct}
        >
          + Add Product
        </button>

        <div className="mt-4 flex justify-end">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-8">
              <span className="font-medium">Total:</span>
              <div className="flex items-center gap-1">
                <span>{currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-32 rounded border p-2 text-right"
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
