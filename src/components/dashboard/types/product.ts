
export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g. {color: 'red', size: 'large', material: 'cotton'}
  price: number | null;
  image?: string;
  inventory?: number;
}

export interface VariantType {
  name: string; // e.g. 'color', 'size', 'material'
  options: string[]; // e.g. ['red', 'blue', 'green']
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  lead_time: string;
  image: string;
  created_at?: string;
  updated_at?: string;
  variants?: ProductVariant[];
  variantTypes?: VariantType[];
  hasVariants?: boolean;
}

export const getDefaultProductImage = (category: string): string => {
  const categoryImages = {
    'Machinery': 'https://5.imimg.com/data5/GE/PZ/AP/SELLER-5909482/knife-edge-belt-conveyor-1000x1000.jpg',
    'default': 'https://kriyanusantara.com/file/image/Office_Table.jpg'
  };
  
  return `${categoryImages[category as keyof typeof categoryImages] || categoryImages.default}?auto=format&fit=crop&w=800&q=80`;
};
