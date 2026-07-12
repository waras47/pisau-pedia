export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}