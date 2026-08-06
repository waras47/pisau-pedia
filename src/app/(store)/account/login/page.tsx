"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { googleLoginUrl, googleStatus, resendVerification } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/model/AuthProvider";
import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
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
  const { t } = useLocaleCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

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
      setError(t("google_failed"));
    }
    if (searchParams.get("verified") === "true") {
      setSuccess(t("verify_success_desc"));
    }
  }, [searchParams, t]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUnverifiedEmail(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        router.push(redirectTo);
      } else {
        const fullName = String(form.get("fullName"));
        const phone = form.get("phone") ? String(form.get("phone")) : undefined;
        await register(email, password, fullName, phone);
        setSuccess(t("register_success"));
        setMode("login");
      }
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.message === "email not verified") {
          setError(t("email_not_verified"));
          setUnverifiedEmail(email);
        } else {
          setError(err.message);
        }
      } else {
        setError(t("generic_error"));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!unverifiedEmail) return;
    setResending(true);
    try {
      await resendVerification(unverifiedEmail);
      setSuccess(t("verification_sent"));
      setError(null);
      setUnverifiedEmail(null);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : t("generic_error"));
    } finally {
      setResending(false);
    }
  }

  function handleGoogleClick() {
    window.location.href = googleLoginUrl();
  }

  return (
    <section className="py-16">
      <Container className="mx-auto flex max-w-sm flex-col gap-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tightest">
            {mode === "login" ? t("login_title") : t("register_title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("login_subtitle")}
          </p>
        </div>

        {success && (
          <div className="rounded border border-green-200 bg-green-50 p-3 text-center text-sm text-green-700">
            {success}
          </div>
        )}

        {googleEnabled && (
          <>
            <button
              type="button"
              onClick={handleGoogleClick}
              className="flex h-11 w-full items-center justify-center gap-3 border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <GoogleIcon />
              {t("continue_google")}
            </button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              {t("or")}
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && (
            <input name="fullName" required placeholder={t("full_name")} className={inputClass} />
          )}
          <input type="email" name="email" required placeholder={t("email_placeholder")} className={inputClass} />
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder={t("password_placeholder")}
            className={inputClass}
          />
          {mode === "register" && (
            <input name="phone" placeholder={t("phone_placeholder")} className={inputClass} />
          )}

          {error && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-red-600">{error}</p>
              {unverifiedEmail && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm font-medium text-accent hover:underline disabled:opacity-50"
                >
                  {resending ? t("processing") : t("resend_verification")}
                </button>
              )}
            </div>
          )}

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? t("processing") : mode === "login" ? t("sign_in") : t("sign_up")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? t("no_account") : t("has_account")}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
              setSuccess(null);
              setUnverifiedEmail(null);
            }}
            className="font-medium text-accent hover:underline"
          >
            {mode === "login" ? t("sign_up") : t("sign_in")}
          </button>
        </p>
      </Container>
    </section>
  );
}
