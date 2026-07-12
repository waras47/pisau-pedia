import { apiFetch } from "@/shared/api/client";
import type { SessionUser, TokenPair } from "@/entities/session/model/session.types";

interface AuthResponse {
  user: SessionUser;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout(refreshToken: string) {
  return apiFetch<null>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export function toTokenPair(res: AuthResponse): TokenPair {
  return {
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    expires_in: res.expires_in,
  };
}