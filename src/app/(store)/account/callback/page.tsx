"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/features/auth/model/AuthProvider";
import { Container } from "@/shared/ui/Container";

// Lands here right after the backend's Google OAuth redirect. The code in
// the URL is single-use and short-lived — this page's only job is to
// immediately trade it for real tokens and get out of the way.
export default function AccountCallbackPage() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const code = searchParams.get("code");
    if (!code) {
      setError(true);
      return;
    }

    loginWithGoogle(code)
      .then(() => router.replace("/"))
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-24">
      <Container className="flex max-w-sm flex-col items-center gap-4 text-center">
        {error ? (
          <>
            <p className="text-foreground">Login dengan Google gagal.</p>
            <button
              type="button"
              onClick={() => router.replace("/account/login?error=google_failed")}
              className="text-sm font-medium text-accent hover:underline"
            >
              Coba lagi
            </button>
          </>
        ) : (
          <p className="text-muted-foreground">Menyelesaikan login…</p>
        )}
      </Container>
    </section>
  );
}
