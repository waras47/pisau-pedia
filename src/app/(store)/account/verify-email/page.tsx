"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { verifyEmail } from "@/features/auth/api/auth.api";
import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

export default function VerifyEmailPage() {
  const { t } = useLocaleCurrency();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg(t("verify_no_token"));
      return;
    }

    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setErrorMsg(err.message || t("verify_failed"));
      });
  }, [token, t]);

  return (
    <section className="py-16">
      <Container className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
        {status === "loading" && (
          <>
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-accent" />
            <h1 className="font-display text-2xl font-semibold">{t("verify_loading")}</h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold">{t("verify_success_title")}</h1>
            <p className="text-muted-foreground">{t("verify_success_desc")}</p>
            <Link href="/account/login">
              <Button size="lg">{t("sign_in")}</Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold">{t("verify_failed_title")}</h1>
            <p className="text-muted-foreground">{errorMsg}</p>
            <Link href="/account/login">
              <Button size="lg" variant="outline">{t("verify_back_login")}</Button>
            </Link>
          </>
        )}
      </Container>
    </section>
  );
}
