"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { HttpError } from "@/shared/api/http-error";

import { useAuth } from "@/features/auth/model/AuthProvider";

export function LoginForm() {
  const { login, sessionExpired } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/pisaupedia/admin");
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {sessionExpired && !error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Sesi kamu habis, silakan login lagi.
        </p>
      )}
      <div>
        <label className="mb-1.5 block text-base font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-base"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-base font-medium">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-base"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gradient-to-r from-[#1a1d29] via-[#252b40] to-emerald-600 px-4 py-3.5 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}