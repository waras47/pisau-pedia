"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { HttpError } from "@/shared/api/http-error";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

import type { SessionUser } from "@/entities/session/model/session.types";

import { changeMyPassword, updateMyProfile } from "@/features/account-settings/api/account.api";
import { useAuth } from "@/features/auth/model/AuthProvider";

const inputClass =
  "h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent";

export default function AccountProfilePage() {
  const { status, user, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/account/login?redirect=/account/profile");
  }, [status, router]);

  if (status !== "authenticated" || !user) return null;

  return (
    <section className="py-16">
      <Container className="mx-auto flex max-w-sm flex-col gap-10">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tightest">
            Pengaturan Akun
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kelola nama, email, dan password akun Anda.
          </p>
        </div>

        <ProfileForm user={user} onUpdated={updateUser} />
        <PasswordForm />
      </Container>
    </section>
  );
}

function ProfileForm({ user, onUpdated }: { user: SessionUser; onUpdated: (u: SessionUser) => void }) {
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const updated = await updateMyProfile({
        full_name: fullName,
        email,
        phone: phone || undefined,
      });
      onUpdated(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Gagal menyimpan profil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Profil
      </h2>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        minLength={2}
        placeholder="Nama lengkap"
        className={inputClass}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className={inputClass}
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Nomor telepon (opsional)"
        className={inputClass}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">Profil berhasil disimpan.</p> : null}

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Menyimpan…" : "Simpan Profil"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      await changeMyPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Gagal mengganti password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-border pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Ganti Password
      </h2>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        placeholder="Password saat ini"
        className={inputClass}
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={8}
        placeholder="Password baru (minimal 8 karakter)"
        className={inputClass}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={8}
        placeholder="Konfirmasi password baru"
        className={inputClass}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">Password berhasil diganti.</p> : null}

      <Button type="submit" size="lg" variant="outline" disabled={loading}>
        {loading ? "Menyimpan…" : "Ganti Password"}
      </Button>
    </form>
  );
}
