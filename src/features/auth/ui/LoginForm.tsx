"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/features/auth/model/AuthProvider";
import { HttpError } from "@/shared/api/http-error";

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
      router.push("/admin");
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      {sessionExpired && !error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Sesi kamu habis, silakan login lagi.
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#1a1d29] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}