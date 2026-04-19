import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

function assertSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
}

function getSupabaseClient() {
  assertSupabaseEnv();

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: AsyncStorage,
      },
    });
  }

  return supabaseClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    return Reflect.get(getSupabaseClient(), property, receiver);
  },
});
