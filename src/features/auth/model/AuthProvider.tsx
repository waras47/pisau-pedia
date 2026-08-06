"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { SESSION_EXPIRED_EVENT } from "@/shared/api/client";

import type { SessionUser } from "@/entities/session/model/session.types";
import { tokenStorage } from "@/entities/session/model/token-storage";

import * as authApi from "@/features/auth/api/auth.api";

type Status = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: Status;
  user: SessionUser | null;
  sessionExpired: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: SessionUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const storedUser = tokenStorage.getUser();
    const accessToken = tokenStorage.getAccessToken();
    if (storedUser && accessToken) {
      setUser(storedUser);
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      setStatus("unauthenticated");
      setSessionExpired(true);
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, []);

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    tokenStorage.save(authApi.toTokenPair(res), res.user);
    setUser(res.user);
    setStatus("authenticated");
    setSessionExpired(false);
  }

  async function register(email: string, password: string, fullName: string, phone?: string) {
    await authApi.register(email, password, fullName, phone);
  }

  async function loginWithGoogle(code: string) {
    const res = await authApi.googleExchange(code);
    tokenStorage.save(authApi.toTokenPair(res), res.user);
    setUser(res.user);
    setStatus("authenticated");
    setSessionExpired(false);
  }

  async function logout() {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => null);
    }
    tokenStorage.clear();
    setUser(null);
    setStatus("unauthenticated");
  }

  // Syncs context + localStorage with the server's response after a profile
  // edit — without this, the header greeting/initial would keep showing
  // stale data until the next full page load.
  function updateUser(updated: SessionUser) {
    tokenStorage.setUser(updated);
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ status, user, sessionExpired, login, register, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}