
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  lead_time: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export const getDefaultProductImage = (category: string): string => {
  const defaultImage = 'https://kriyanusantara.com/file/image/Office_Table.jpg';
  return `${defaultImage}?auto=format&fit=crop&w=800&q=80`;
};

