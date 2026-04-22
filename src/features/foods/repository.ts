import { supabase } from '../../lib/supabase/client';
import type { FoodItem, FoodItemRow, FoodItemWriteInput } from './types';

function mapFoodItem(row: FoodItemRow): FoodItem {
  return {
    id: row.id,
    userId: row.user_id,
    // Legacy migration-based fridge linkage is disabled because the live DB has no fridge_id column.
    fridgeId: row.fridge_id ?? undefined,
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
  // Legacy migration-based fridge query is disabled because the live DB has no fridges table.
  // async listByFridge(userId: string, fridgeId: string) {
  //   const { data, error } = await supabase
  //     .from('food_items')
  //     .select('*')
  //     .eq('user_id', userId)
  //     .eq('fridge_id', fridgeId)
  //     .order('expiry_date', { ascending: true })
  //     .order('created_at', { ascending: true });
  //
  //   if (error) {
  //     throw error;
  //   }
  //
  //   return (data as FoodItemRow[]).map(mapFoodItem);
  // }

  async listByUser(userId: string) {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('user_id', userId)
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
      name: input.name,
      expiry_date: input.expiryDate,
      quantity: input.quantity ?? null,
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
      ...(input.name ? { name: input.name } : {}),
      ...(input.expiryDate ? { expiry_date: input.expiryDate } : {}),
      ...(input.quantity !== undefined ? { quantity: input.quantity ?? null } : {}),
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

// Legacy migration-based fridge query is disabled because the live DB has no fridges table.
// export async function listFoodItems(fridgeId: string) {
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();
//
//   if (error) {
//     throw error;
//   }
//
//   if (!user) {
//     throw new Error('로그인이 필요합니다.');
//   }
//
//   return foodRepository.listByFridge(user.id, fridgeId);
// }

export async function listFoodItems() {
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

  return foodRepository.listByUser(user.id);
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
