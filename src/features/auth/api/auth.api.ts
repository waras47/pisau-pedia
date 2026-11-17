import { env } from "@/shared/config/env";
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

interface RegisterResponse {
  user: SessionUser;
  requires_verification: boolean;
}

export function register(email: string, password: string, fullName: string, phone?: string) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: fullName, phone }),
  });
}

// googleLoginUrl is a full-page navigation target (not a fetch) — the
// browser needs to actually leave the app to reach Google's consent screen.
export function googleLoginUrl() {
  return `${env.apiBaseUrl}/auth/google`;
}

export function googleStatus() {
  return apiFetch<{ enabled: boolean }>("/auth/google/status");
}

// googleExchange trades the single-use code from the /account/callback
// redirect for real tokens — same response shape as login()/register().
export function googleExchange(code: string) {
  return apiFetch<AuthResponse>("/auth/google/exchange", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function verifyEmail(token: string) {
  return apiFetch<null>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export function resendVerification(email: string) {
  return apiFetch<null>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
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