// 로그인/회원가입 데이터 타입 선언
export interface AuthCredentials {
  loginId: string;
  password: string;
}

export interface SignUpInput {
  loginId: string;
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
}
