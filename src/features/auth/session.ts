import { supabase } from "../../lib/supabase/client";

export interface AuthSessionUser {
  id: string;
  email: string | null;
}

function mapAuthSessionUser(
  user: { id: string; email?: string | null } | null,
): AuthSessionUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

export class AuthSessionRepository {
  //  로그인한 사용자가 있는지 확인
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

  // 로그인한 사용자가 없으면 예외를 던지는 메서드
  async requireCurrentUser() {
    const user = await this.getCurrentUser();

    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    return user;
  }
}
