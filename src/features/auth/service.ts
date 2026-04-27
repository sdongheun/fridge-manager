import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../../lib/supabase/client';
import type { AuthCredentials, AuthUser, SignUpInput } from './types';

// 실제 인증 동작을 처리
function mapAuthUser(session: Session | null): AuthUser | null {
  return mapUser(session?.user ?? null);
}

function mapUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    displayName:
      typeof user.user_metadata.display_name === 'string'
        ? user.user_metadata.display_name
        : null,
  };
}

export async function signUp({
  loginId,
  email,
  password,
  displayName,
  phoneNumber,
}: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        login_id: loginId,
        display_name: displayName ?? null,
        phone_number: phoneNumber ?? null,
      },
    },
  });

  if (error) {
    throw error;
  }

  return mapAuthUser(data.session);
}

async function findEmailByLoginId(loginId: string) {
  const { data, error } = await supabase.rpc('find_auth_email_by_login_id', {
    input_login_id: loginId,
  });

  if (error) {
    throw error;
  }

  if (!data || typeof data !== 'string') {
    throw new Error('해당 아이디로 가입된 계정을 찾을 수 없습니다.');
  }

  return data;
}

export async function signIn({ loginId, password }: AuthCredentials) {
  const email = await findEmailByLoginId(loginId);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return mapUser(data.user);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return mapAuthUser(data.session);
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(mapAuthUser(session));
  });

  return () => subscription.unsubscribe();
}
