"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  listMyServiceRequests,
  type ServiceRequestResponse,
} from "@/entities/service-request/api/service-request.api";
import { useAuth } from "@/features/auth/model/AuthProvider";
import { HttpError } from "@/shared/api/http-error";
import { Container } from "@/shared/ui/Container";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const statusLabel: Record<string, string> = {
  pending: "Menunggu",
  in_progress: "Sedang Diproses",
  completed: "Selesai",
  rejected: "Ditolak",
};

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

const typeLabel: Record<string, string> = {
  sharpening: "Pengasahan",
  engraving: "Engraving",
};

export default function MyServicesPage() {
  const { status } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.replace("/account/login?redirect=/account/services");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    listMyServiceRequests()
      .then(setRequests)
      .catch((err) => setError(err instanceof HttpError ? err.message : "Gagal memuat data servis"))
      .finally(() => setLoading(false));
  }, [status]);

  if (status !== "authenticated") return null;

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tightest">Servis Saya</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Riwayat permintaan pengasahan dan engraving pisau Anda.
          </p>
        </div>

        <div className="flex gap-3 text-sm">
          <Link href="/account/orders" className="rounded-full border border-border px-4 py-1.5 text-muted-foreground hover:bg-muted">
            Pesanan
          </Link>
          <span className="rounded-full bg-foreground px-4 py-1.5 text-background">
            Servis
          </span>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Memuat…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-start gap-4">
            <p className="text-muted-foreground">Belum ada permintaan servis.</p>
            <div className="flex gap-3">
              <Link href="/pages/sharpening-repairs" className="text-sm font-medium text-accent hover:underline">
                Pengasahan Pisau
              </Link>
              <Link href="/pages/engraving-request" className="text-sm font-medium text-accent hover:underline">
                Engraving Pisau
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {requests.map((r) => (
              <div key={r.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                      {typeLabel[r.type] ?? r.type}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyle[r.status] ?? "bg-gray-50 text-gray-600"}`}>
                      {statusLabel[r.status] ?? r.status}
                    </span>
                  </div>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground line-clamp-2">{r.message}</p>
                  {r.admin_notes && (
                    <div className="mt-1 rounded bg-muted px-3 py-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Catatan admin:</span> {r.admin_notes}
                    </div>
                  )}
                  {r.quoted_price != null && r.quoted_price > 0 && (
                    <p className="mt-1 text-sm font-medium text-foreground">
                      Harga: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(r.quoted_price)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-muted-foreground">#{r.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
