
export interface RawMaterialFromDB {
  id: string;
  name: string;
  category: string | null;
  unit: string;
  status: string | null;
  vendor: string | null;
  abc_classification: string | null;
  created_at: string;
  updated_at: string;
}
