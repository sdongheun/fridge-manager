import { supabase } from '../../lib/supabase/client';
import type { Fridge, FridgeRow } from './types';

function mapFridge(row: FridgeRow): Fridge {
  return {
    id: row.id,
    ownerUserId: row.owner_user_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class FridgeRepository {
  async getOwnedFridgeByUserId(ownerUserId: string) {
    const { data, error } = await supabase
      .from('fridges')
      .select('*')
      .eq('owner_user_id', ownerUserId)
      .single();

    if (error) {
      throw error;
    }

    return mapFridge(data as FridgeRow);
  }
}

const fridgeRepository = new FridgeRepository();

export async function getMyFridge() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  return fridgeRepository.getOwnedFridgeByUserId(user.id);
}
