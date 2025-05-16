
import React, { useState } from "react";
import type { RFQProductItem } from "./types/quoteTypes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomProductInput, CustomProduct } from "./components/CustomProductInput";

interface Product {
  id: string;
  name: string;
  category?: string;
}

interface QuoteDetailProductsSectionProps {
  products: RFQProductItem[];
  setProducts: (items: RFQProductItem[]) => void;
  customProducts: CustomProduct[];
  setCustomProducts: (items: CustomProduct[]) => void;
  total: number;
  setTotal: (total: number) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

export const QuoteDetailProductsSection: React.FC<QuoteDetailProductsSectionProps> = ({
  products,
  setProducts,
  customProducts,
  setCustomProducts,
  total,
  setTotal,
  currency,
  setCurrency,
}) => {
  const [showProductSelector, setShowProductSelector] = useState(false);

  const { data: availableProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category')
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    }
  });

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

  const handleProductSelection = (product: Product) => {
    setProducts([...products, { name: product.name, quantity: 1, id: product.id }]);
    setShowProductSelector(false);
  };

  const handleAddCustomProduct = () => {
    setCustomProducts([...customProducts, { name: "", documents: [] }]);
  };

  const handleCustomProductChange = (index: number, updatedProduct: CustomProduct) => {
    const items = [...customProducts];
    items[index] = updatedProduct;
    setCustomProducts(items);
  };

  const handleRemoveProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  const handleRemoveCustomProduct = (idx: number) => {
    setCustomProducts(customProducts.filter((_, i) => i !== idx));
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
        {products.length === 0 && customProducts.length === 0 ? (
          <div className="text-center py-2">No products added yet</div>
        ) : (
          <>
            {/* Regular products list */}
            {products.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Standard Products</h4>
                <ul className="space-y-2">
                  {products.map((prod, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <select
                          className="w-full rounded border p-2"
                          value={prod.id || ''}
                          onChange={(e) => {
                            const selectedProduct = availableProducts.find(p => p.id === e.target.value);
                            if (selectedProduct) {
                              handleProductNameChange(idx, selectedProduct.name);
                              const updatedProducts = [...products];
                              updatedProducts[idx] = { ...updatedProducts[idx], id: selectedProduct.id, name: selectedProduct.name };
                              setProducts(updatedProducts);
                            }
                          }}
                        >
                          <option value="">-- Select a product --</option>
                          {availableProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.category ? `(${p.category})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
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
              </div>
            )}

            {/* Custom products list */}
            {customProducts.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Custom Products</h4>
                <div className="space-y-3">
                  {customProducts.map((customProd, idx) => (
                    <CustomProductInput
                      key={idx}
                      product={customProd}
                      index={idx}
                      onChange={(product) => handleCustomProductChange(idx, product)}
                      onRemove={() => handleRemoveCustomProduct(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowProductSelector(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddCustomProduct}
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Custom Product
          </Button>
        </div>

        {showProductSelector && (
          <div className="mt-3 border rounded p-3 bg-white">
            <h4 className="text-sm font-medium mb-2">Select a product</h4>
            <div className="max-h-64 overflow-y-auto">
              <ul className="divide-y">
                {availableProducts.map((product) => (
                  <li key={product.id} className="py-2">
                    <button
                      type="button"
                      className="w-full text-left hover:bg-gray-50 px-2 py-1 rounded"
                      onClick={() => handleProductSelection(product)}
                    >
                      {product.name} {product.category ? <span className="text-gray-500 text-sm">({product.category})</span> : ''}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 text-right">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowProductSelector(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

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
