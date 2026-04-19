import { supabase } from '../../lib/supabase/client';
import type { FoodItem, FoodItemRow, FoodItemWriteInput } from './types';

function mapFoodItem(row: FoodItemRow): FoodItem {
  return {
    id: row.id,
    userId: row.user_id,
    fridgeId: row.fridge_id,
    name: row.name,
    expiryDate: row.expiry_date,
    purchaseDate: row.purchase_date ?? undefined,
    quantity: row.quantity ?? undefined,
    unit: row.unit ?? undefined,
    memo: row.memo ?? undefined,
    category: row.category ?? undefined,
    storageZone: row.storage_zone ?? undefined,
    barcode: row.barcode ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class FoodRepository {
  async listByFridge(userId: string, fridgeId: string) {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('user_id', userId)
      .eq('fridge_id', fridgeId)
      .order('expiry_date', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return (data as FoodItemRow[]).map(mapFoodItem);
  }

  async create(userId: string, input: FoodItemWriteInput) {
    const payload = {
      user_id: userId,
      fridge_id: input.fridgeId,
      name: input.name,
      expiry_date: input.expiryDate,
      purchase_date: input.purchaseDate ?? null,
      quantity: input.quantity ?? null,
      unit: input.unit ?? null,
      memo: input.memo ?? null,
      category: input.category ?? null,
      storage_zone: input.storageZone ?? null,
      barcode: input.barcode ?? null,
    };

    const { data, error } = await supabase
      .from('food_items')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapFoodItem(data as FoodItemRow);
  }

  async update(userId: string, id: string, input: Partial<FoodItemWriteInput>) {
    const payload = {
      ...(input.fridgeId ? { fridge_id: input.fridgeId } : {}),
      ...(input.name ? { name: input.name } : {}),
      ...(input.expiryDate ? { expiry_date: input.expiryDate } : {}),
      ...(input.purchaseDate !== undefined ? { purchase_date: input.purchaseDate ?? null } : {}),
      ...(input.quantity !== undefined ? { quantity: input.quantity ?? null } : {}),
      ...(input.unit !== undefined ? { unit: input.unit ?? null } : {}),
      ...(input.memo !== undefined ? { memo: input.memo ?? null } : {}),
      ...(input.category !== undefined ? { category: input.category ?? null } : {}),
      ...(input.storageZone !== undefined ? { storage_zone: input.storageZone ?? null } : {}),
      ...(input.barcode !== undefined ? { barcode: input.barcode ?? null } : {}),
    };

    const { data, error } = await supabase
      .from('food_items')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapFoodItem(data as FoodItemRow);
  }

  async delete(userId: string, id: string) {
    const { error } = await supabase.from('food_items').delete().eq('id', id).eq('user_id', userId);

    if (error) {
      throw error;
    }
  }
}

const foodRepository = new FoodRepository();

export async function listFoodItems(fridgeId: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  return foodRepository.listByFridge(user.id, fridgeId);
}

export async function createFoodItem(input: FoodItemWriteInput) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  return foodRepository.create(user.id, input);
}

export async function updateFoodItem(id: string, input: Partial<FoodItemWriteInput>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  return foodRepository.update(user.id, id, input);
}

export async function deleteFoodItem(id: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  return foodRepository.delete(user.id, id);
}
