export interface AuthTokenResponse {
  token: string;
  expiresAt: string;
}

export interface AuthUserProfile {
  id: string;
  email: string;
  name?: string;
  userName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name?: string;
  email: string;
  password: string;
}
