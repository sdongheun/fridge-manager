import { supabase } from '../../lib/supabase/client';

export interface AuthSessionUser {
  id: string;
  email: string | null;
}

function mapAuthSessionUser(user: { id: string; email?: string | null } | null): AuthSessionUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

export class AuthSessionRepository {
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return mapAuthSessionUser(user);
  }

  async requireCurrentUser() {
    const user = await this.getCurrentUser();

    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    return user;
  }
}
