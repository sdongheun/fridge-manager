export type FoodStatus = 'fresh' | 'soon' | 'expired';

export type StorageZone = 'fridge' | 'freezer' | 'pantry';

export interface FoodItem {
  id: string;
  userId: string;
  // Legacy migration-based fridge linkage is disabled because the live DB has no fridges table.
  fridgeId?: string;
  name: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  purchaseDate?: string;
  quantity?: number;
  unit?: string;
  memo?: string;
  category?: string;
  storageZone?: StorageZone;
  barcode?: string;
}

export interface FoodItemWriteInput {
  name: string;
  expiryDate: string;
  // Legacy migration-based fridge linkage is disabled because the live DB has no fridges table.
  fridgeId?: string;
  purchaseDate?: string;
  quantity?: number;
  unit?: string;
  memo?: string;
  category?: string;
  storageZone?: StorageZone;
  barcode?: string;
}

export interface FoodItemRow {
  id: string;
  user_id: string;
  // Legacy migration-based fridge linkage is disabled because the live DB has no fridge_id column.
  fridge_id?: string | null;
  name: string;
  expiry_date: string;
  purchase_date?: string | null;
  quantity: number | null;
  // The live DB currently does not have these columns. Keep them optional until the schema is updated.
  unit: string | null;
  memo: string | null;
  category: string | null;
  storage_zone: StorageZone | null;
  barcode: string | null;
  created_at: string;
  updated_at: string;
}
