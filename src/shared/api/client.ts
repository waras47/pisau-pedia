import { env } from "@/shared/config/env";

import { tokenStorage } from "@/entities/session/model/token-storage";

import { HttpError } from "./http-error";

export interface ApiMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiEnvelope<T> {
  message: string;
  data: T;
  meta?: ApiMeta;
  errors?: unknown;
}

// Dispatched whenever a refresh attempt fails for a session that actually
// had a refresh token (i.e. the user was logged in) — AuthProvider listens
// for this to flip its status to "unauthenticated" immediately, instead of
// silently leaving stale UI state around until the next guarded request.
export const SESSION_EXPIRED_EVENT = "pp:session-expired";

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    tokenStorage.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return null;
  }
  const json = (await res.json()) as ApiEnvelope<{ access_token: string; refresh_token: string }>;
  tokenStorage.setAccessToken(json.data.access_token);
  return json.data.access_token;
}

async function apiFetchEnvelope<T>(
  path: string,
  options: RequestInit = {},
  _retry = false,
): Promise<ApiEnvelope<T>> {
  const accessToken = tokenStorage.getAccessToken();

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && !_retry) {
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const newToken = await refreshPromise;
    if (newToken) return apiFetchEnvelope<T>(path, options, true);
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok) {
    // Validation failures put the human-readable detail in `errors`
    // (e.g. "Name is required; Price must be at least 0") while `message`
    // stays a generic "validation failed" — prefer the detail when present.
    const detail = typeof json?.errors === "string" && json.errors ? json.errors : undefined;
    throw new HttpError(res.status, detail ?? json?.message ?? "Request failed");
  }

  return json!;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const envelope = await apiFetchEnvelope<T>(path, options);
  return envelope.data;
}

export interface PaginatedResult<T> {
  data: T;
  meta: ApiMeta;
}

export async function apiFetchPaginated<T>(
  path: string,
  options: RequestInit = {},
): Promise<PaginatedResult<T>> {
  const envelope = await apiFetchEnvelope<T>(path, options);
  return { data: envelope.data, meta: envelope.meta! };
}