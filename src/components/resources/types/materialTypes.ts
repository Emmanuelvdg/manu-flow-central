
export interface RawMaterialFromDB {
  id: string;
  name: string;
  category: string | null;
  unit: string;
  status: string | null;
  vendor: string | null;
  created_at: string;
  updated_at: string;
}
