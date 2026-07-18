"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { googleLoginUrl, googleStatus } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/model/AuthProvider";
import { HttpError } from "@/shared/api/http-error";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.96 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

const inputClass =
  "h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent";

export default function AccountLoginPage() {
  const { login, register, status } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.replace(redirectTo);
  }, [status, redirectTo, router]);

  useEffect(() => {
    googleStatus()
      .then((res) => setGoogleEnabled(res.enabled))
      .catch(() => setGoogleEnabled(false));
  }, []);

  useEffect(() => {
    if (searchParams.get("error") === "google_failed") {
      setError("Login dengan Google gagal. Silakan coba lagi.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        const fullName = String(form.get("fullName"));
        const phone = form.get("phone") ? String(form.get("phone")) : undefined;
        await register(email, password, fullName, phone);
      }
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleClick() {
    const url = new URL(googleLoginUrl());
    window.location.href = url.toString();
  }

  return (
    <section className="py-16">
      <Container className="mx-auto flex max-w-sm flex-col gap-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tightest">
            {mode === "login" ? "Masuk ke akun Anda" : "Buat akun baru"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Belanja lebih cepat dan lacak pesanan Anda — atau lanjutkan sebagai tamu saat checkout.
          </p>
        </div>

        {googleEnabled && (
          <>
            <button
              type="button"
              onClick={handleGoogleClick}
              className="flex h-11 w-full items-center justify-center gap-3 border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <GoogleIcon />
              Lanjutkan dengan Google
            </button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              atau
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && (
            <input name="fullName" required placeholder="Nama lengkap" className={inputClass} />
          )}
          <input type="email" name="email" required placeholder="Email" className={inputClass} />
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="Password (minimal 8 karakter)"
            className={inputClass}
          />
          {mode === "register" && (
            <input name="phone" placeholder="Nomor telepon (opsional)" className={inputClass} />
          )}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            className="font-medium text-accent hover:underline"
          >
            {mode === "login" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </Container>
    </section>
  );
}
