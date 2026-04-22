// 로그인/회원가입 데이터 타입 선언
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpInput extends AuthCredentials {
  displayName?: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
}
