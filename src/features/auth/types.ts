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
