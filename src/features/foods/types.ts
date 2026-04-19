export type FoodStatus = 'fresh' | 'soon' | 'expired';

export type StorageZone = 'fridge' | 'freezer' | 'pantry';

export interface FoodItem {
  id: string;
  userId: string;
  fridgeId: string;
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
  fridgeId: string;
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
  fridge_id: string;
  name: string;
  expiry_date: string;
  purchase_date: string | null;
  quantity: number | null;
  unit: string | null;
  memo: string | null;
  category: string | null;
  storage_zone: StorageZone | null;
  barcode: string | null;
  created_at: string;
  updated_at: string;
}
