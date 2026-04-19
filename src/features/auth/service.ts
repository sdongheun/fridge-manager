import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../../lib/supabase/client';
import type { AuthCredentials, AuthUser, SignUpInput } from './types';

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
    displayName: typeof user.user_metadata.display_name === 'string'
      ? user.user_metadata.display_name
      : null,
  };
}

export async function signUp({ email, password, displayName }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName ?? null,
      },
    },
  });

  if (error) {
    throw error;
  }

  return mapAuthUser(data.session);
}

export async function signIn({ email, password }: AuthCredentials) {
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
