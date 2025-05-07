
import React from 'react';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceItemsProps {
  items: InvoiceItem[];
  totalAmount: number;
}

export const InvoiceItems = ({ items, totalAmount }: InvoiceItemsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Items</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Description</th>
              <th className="text-right py-2 px-2">Quantity</th>
              <th className="text-right py-2 px-2">Unit Price</th>
              <th className="text-right py-2 px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-2">{item.description}</td>
                <td className="text-right py-2 px-2">{item.quantity}</td>
                <td className="text-right py-2 px-2">${item.unitPrice.toLocaleString()}</td>
                <td className="text-right py-2 px-2">${item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col items-end space-y-2">
        <div className="flex justify-between w-full md:w-1/3">
          <span className="font-medium">Total:</span>
          <span className="font-semibold">${totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
