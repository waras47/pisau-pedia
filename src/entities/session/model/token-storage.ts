import type { SessionUser, TokenPair } from "./session.types";

const ACCESS_KEY = "pp_access_token";
const REFRESH_KEY = "pp_refresh_token";
const USER_KEY = "pp_user";

export const tokenStorage = {
  save(tokens: TokenPair, user: SessionUser) {
    localStorage.setItem(ACCESS_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },
  getUser(): SessionUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  },
  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_KEY, token);
  },
  setUser(user: SessionUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};