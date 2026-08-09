"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { confirmOrderReceived, getMyOrder, type OrderItemResponse, type OrderResponse } from "@/entities/order/api/order.api";
import { orderStatusLabel, orderStatusStyle, paymentStatusLabel, paymentStyle } from "@/entities/order/model/order-status";
import { createReview, uploadReviewPhoto } from "@/entities/review/api/review.api";
import { useAuth } from "@/features/auth/model/AuthProvider";
import { HttpError } from "@/shared/api/http-error";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Frontend-only "did I already review this item" memory — there's no
// backend flag for it (reviews aren't linked to orders in the schema), so
// a reload shouldn't re-show a form the customer already submitted. See
// docs/16-plan-konfirmasi-pesanan-diterima-review.md (backend repo).
function reviewedKey(orderId: string) {
  return `pp-reviewed-${orderId}`;
}
function loadReviewedSlugs(orderId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(reviewedKey(orderId)) ?? "[]");
  } catch {
    return [];
  }
}
function markReviewed(orderId: string, slug: string) {
  const current = loadReviewedSlugs(orderId);
  if (!current.includes(slug)) {
    localStorage.setItem(reviewedKey(orderId), JSON.stringify([...current, slug]));
  }
}

function ReviewForm({
  item,
  customerName,
  onSubmitted,
}: {
  item: OrderItemResponse;
  customerName: string;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    if (photos.length + files.length > 5) {
      setError("Maksimal 5 foto");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadReviewPhoto(file);
        urls.push(url);
      }
      setPhotos((prev) => [...prev, ...urls]);
    } catch {
      setError("Gagal upload foto");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createReview({
        product_slug: item.product_slug,
        customer_name: customerName,
        rating,
        content,
        photos: photos.length > 0 ? photos : undefined,
      });
      onSubmitted();
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Gagal mengirim review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-border p-4">
      <p className="text-sm font-medium">{item.product_name}</p>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} bintang`}
            onClick={() => setRating(n)}
            className={`text-xl ${n <= rating ? "text-amber-500" : "text-muted-foreground/40"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        required
        minLength={5}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bagaimana kualitas produknya?"
        className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
      />

      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">Foto produk (opsional, maks 5)</p>
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {photos.map((url, i) => (
              <div key={url} className="relative">
                <img src={url} alt={`Foto ${i + 1}`} className="h-16 w-16 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {photos.length < 5 && (
          <label className={`cursor-pointer self-start rounded border border-border px-3 py-1.5 text-xs hover:bg-muted/50 ${uploading ? "opacity-40 pointer-events-none" : ""}`}>
            {uploading ? "Mengupload..." : "Tambah Foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" size="sm" disabled={loading || uploading} className="self-start">
        {loading ? "Mengirim…" : "Kirim Review"}
      </Button>
    </form>
  );
}

export default function MyOrderDetailPage() {
  const { status, user } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [reviewedSlugs, setReviewedSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.replace(`/account/login?redirect=/account/orders/${orderId}`);
  }, [status, router, orderId]);

  useEffect(() => {
    if (status !== "authenticated") return;
    getMyOrder(orderId)
      .then((o) => {
        setOrder(o);
        setReviewedSlugs(loadReviewedSlugs(orderId));
      })
      .catch((err) => setLoadError(err instanceof HttpError ? err.message : "Gagal memuat pesanan"))
      .finally(() => setLoading(false));
  }, [status, orderId]);

  async function handleConfirm() {
    setConfirmError(null);
    setConfirming(true);
    try {
      const updated = await confirmOrderReceived(orderId);
      setOrder(updated);
    } catch (err) {
      setConfirmError(err instanceof HttpError ? err.message : "Gagal konfirmasi pesanan diterima");
    } finally {
      setConfirming(false);
    }
  }

  if (status !== "authenticated" || loading) return null;

  if (loadError || !order) {
    return (
      <section className="py-16">
        <Container className="max-w-2xl">
          <p className="text-red-600">{loadError ?? "Pesanan tidak ditemukan."}</p>
        </Container>
      </section>
    );
  }

  const canConfirm = order.payment_status === "paid" && order.status !== "cancelled" && !order.customer_confirmed_at;
  const showReviewForms = Boolean(order.customer_confirmed_at);

  return (
    <section className="py-16">
      <Container className="flex max-w-2xl flex-col gap-8">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tightest">
            Pesanan #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusStyle(order.status)}`}>
            {orderStatusLabel(order.status)}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStyle(order.payment_status)}`}>
            {paymentStatusLabel(order.payment_status)}
          </span>
          {order.customer_confirmed_at ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
              ✅ Diterima {formatDate(order.customer_confirmed_at)}
            </span>
          ) : null}
        </div>

        <div className="divide-y divide-border border-y border-border">
          {(order.items ?? []).map((item) => (
            <div key={item.product_slug} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × {formatRupiah(item.price)}
                </p>
              </div>
              <p className="font-medium">{formatRupiah(item.subtotal)}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatRupiah(order.total)}</span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-muted-foreground">Alamat Pengiriman</p>
          <p className="text-sm">
            {order.shipping_address}, {order.shipping_city}
            {order.shipping_province ? `, ${order.shipping_province}` : ""} {order.shipping_postal_code}
          </p>
        </div>

        {canConfirm ? (
          <div className="border border-border p-4">
            <p className="mb-3 text-sm">Sudah menerima paketnya?</p>
            <Button onClick={handleConfirm} disabled={confirming}>
              {confirming ? "Memproses…" : "Pesanan Diterima"}
            </Button>
            {confirmError ? <p className="mt-2 text-sm text-red-600">{confirmError}</p> : null}
          </div>
        ) : null}

        {showReviewForms ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-semibold tracking-tightest">Beri Review Produk</h2>
            {(order.items ?? []).map((item) =>
              reviewedSlugs.includes(item.product_slug) ? (
                <p key={item.product_slug} className="text-sm text-emerald-600">
                  ✅ Terima kasih atas review Anda untuk {item.product_name}.
                </p>
              ) : (
                <ReviewForm
                  key={item.product_slug}
                  item={item}
                  customerName={user?.full_name ?? order.customer_name}
                  onSubmitted={() => {
                    markReviewed(orderId, item.product_slug);
                    setReviewedSlugs((prev) => [...prev, item.product_slug]);
                  }}
                />
              ),
            )}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
