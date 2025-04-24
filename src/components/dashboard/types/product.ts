
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
  const categoryImages = {
    'Machinery': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'Electronics': 'https://images.unsplash.com/photo-1601524978366-34c5c6e2c3c4',
    'Tools': 'https://images.unsplash.com/photo-1581089778245-3ce67677f718',
    'Materials': 'https://kriyanusantara.com/file/image/Office_Table.jpg',
    'default': 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9'
  };
  
  return `${categoryImages[category as keyof typeof categoryImages] || categoryImages.default}?auto=format&fit=crop&w=800&q=80`;
};
