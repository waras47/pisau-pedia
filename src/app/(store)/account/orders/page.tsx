"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getMyOrders, type OrderResponse } from "@/entities/order/api/order.api";
import { orderStatusLabel, orderStatusStyle, paymentStatusLabel, paymentStyle } from "@/entities/order/model/order-status";
import { useAuth } from "@/features/auth/model/AuthProvider";
import { HttpError } from "@/shared/api/http-error";
import { Container } from "@/shared/ui/Container";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyOrdersPage() {
  const { status } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.replace("/account/login?redirect=/account/orders");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof HttpError ? err.message : "Gagal memuat pesanan"))
      .finally(() => setLoading(false));
  }, [status]);

  if (status !== "authenticated") return null;

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-8">
        <h1 className="font-display text-2xl font-semibold tracking-tightest">Pesanan Saya</h1>

        <div className="flex gap-3 text-sm">
          <span className="rounded-full bg-foreground px-4 py-1.5 text-background">
            Pesanan
          </span>
          <Link href="/account/services" className="rounded-full border border-border px-4 py-1.5 text-muted-foreground hover:bg-muted">
            Servis
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Memuat…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-start gap-4">
            <p className="text-muted-foreground">Belum ada pesanan.</p>
            <Link href="/collections/knives" className="text-sm font-medium text-accent hover:underline">
              Mulai belanja
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(o.created_at)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${orderStatusStyle(o.status)}`}>
                    {orderStatusLabel(o.status)}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${paymentStyle(o.payment_status)}`}>
                    {paymentStatusLabel(o.payment_status)}
                  </span>
                  {o.customer_confirmed_at ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                      ✅ Diterima
                    </span>
                  ) : null}
                </div>
                <span className="text-sm font-semibold">{formatRupiah(o.total)}</span>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
