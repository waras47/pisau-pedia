"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

import { paymentConfig } from "@/shared/config/payment.config";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

import { getPublicOrder, type OrderResponse, uploadPaymentProof } from "@/entities/order/api/order.api";

import { useCart } from "@/features/cart";

const PAYMENT_DEADLINE_HOURS = 12;

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function useCountdown(targetDate: Date | null) {
  const calcRemaining = useCallback(() => {
    if (!targetDate) return 0;
    return Math.max(0, targetDate.getTime() - Date.now());
  }, [targetDate]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    setRemaining(calcRemaining());
    const id = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [calcRemaining]);

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const expired = remaining <= 0 && targetDate !== null;

  return { hours, minutes, seconds, remaining, expired };
}

interface CheckoutSuccessContentProps {
  orderId?: string;
}

export function CheckoutSuccessContent({ orderId }: CheckoutSuccessContentProps) {
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderId) return;
    getPublicOrder(orderId)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [orderId]);

  const deadline = useMemo(() => {
    if (!order?.created_at) return null;
    const created = new Date(order.created_at);
    return new Date(created.getTime() + PAYMENT_DEADLINE_HOURS * 3600000);
  }, [order?.created_at]);

  const { hours, minutes, seconds, expired } = useCountdown(deadline);

  async function handleUpload() {
    if (!file || !orderId) return;
    setUploading(true);
    setUploadError(null);
    try {
      const updated = await uploadPaymentProof(orderId, file);
      setOrder(updated);
    } catch {
      setUploadError("Gagal mengunggah bukti pembayaran, coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  function copyAccountNumber() {
    navigator.clipboard.writeText(paymentConfig.bankTransfer.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const needsPayment = order && order.payment_status !== "paid";
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-24">
      <Container className="flex max-w-lg flex-col items-center gap-4 text-center">
        {expired && needsPayment ? (
          <>
            <AlertTriangle size={56} className="text-red-500" />
            <h1 className="font-display text-3xl font-semibold tracking-tightest">
              Pesanan Dibatalkan
            </h1>
            <p className="text-muted-foreground">
              Batas waktu pembayaran telah habis. Pesanan #{order.id.slice(0, 8)} otomatis dibatalkan.
              Silakan buat pesanan baru.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 size={56} className="text-green-600" />
            <h1 className="font-display text-3xl font-semibold tracking-tightest">
              Terima kasih atas pesanan Anda
            </h1>
            <p className="text-muted-foreground">
              {order
                ? `Pesanan #${order.id.slice(0, 8)} berhasil dibuat. Selesaikan pembayaran sesuai instruksi di bawah, lalu unggah bukti transfer.`
                : "Pesanan Anda berhasil dibuat."}
            </p>
          </>
        )}

        {needsPayment && !expired && (
          <div className="mt-4 w-full rounded-lg border border-border bg-surface p-6 text-left">
            {/* Countdown timer */}
            <div className="mb-5 flex flex-col items-center gap-2 rounded-lg border border-amber-300/50 bg-amber-50 p-4 text-center dark:border-amber-700/50 dark:bg-amber-950/30">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
                <Clock size={16} />
                <span>Batas waktu pembayaran</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-3xl font-bold tabular-nums text-amber-900 dark:text-amber-200">
                <span className="rounded bg-amber-200/60 px-2 py-1 dark:bg-amber-800/40">{pad(hours)}</span>
                <span className="animate-pulse">:</span>
                <span className="rounded bg-amber-200/60 px-2 py-1 dark:bg-amber-800/40">{pad(minutes)}</span>
                <span className="animate-pulse">:</span>
                <span className="rounded bg-amber-200/60 px-2 py-1 dark:bg-amber-800/40">{pad(seconds)}</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Pesanan otomatis dibatalkan jika pembayaran tidak diterima dalam {PAYMENT_DEADLINE_HOURS} jam
              </p>
            </div>

            <p className="mb-1 text-sm text-muted-foreground">Total yang harus dibayar</p>
            <p className="mb-4 font-display text-2xl font-bold">{formatRupiah(order.total)}</p>

            {order.payment_type === "bank_transfer" && (
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-medium">{paymentConfig.bankTransfer.bankName}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg">{paymentConfig.bankTransfer.accountNumber}</span>
                  <button type="button" onClick={copyAccountNumber} className="text-xs text-accent underline">
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <p className="text-muted-foreground">a.n. {paymentConfig.bankTransfer.accountHolder}</p>
              </div>
            )}

            {order.payment_type === "shopeepay" && (
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-mono text-lg">{paymentConfig.shopeepay.number}</span>
                <p className="text-muted-foreground">a.n. {paymentConfig.shopeepay.holder}</p>
              </div>
            )}

            {order.payment_type === "dana" && (
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-mono text-lg">{paymentConfig.dana.number}</span>
                <p className="text-muted-foreground">a.n. {paymentConfig.dana.holder}</p>
              </div>
            )}

            {order.payment_type === "qris" && (
              <div className="flex flex-col items-center gap-2">
                {paymentConfig.qris.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={paymentConfig.qris.imageUrl} alt="QRIS" className="w-48" />
                ) : (
                  <PlaceholderImage label="QRIS belum dipasang admin" ratio="square" className="w-48" />
                )}
                <p className="text-xs text-muted-foreground">
                  Scan pakai aplikasi e-wallet atau m-banking apa saja.
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-border pt-4">
              {order.payment_proof_url ? (
                <p className="text-sm text-green-700">
                  ✓ Bukti pembayaran sudah diterima. Kami akan konfirmasi pesanan Anda secepatnya.
                </p>
              ) : (
                <>
                  <label className="mb-2 block text-sm font-medium">
                    Unggah bukti transfer (opsional, mempercepat konfirmasi)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="mb-2 block w-full text-sm"
                  />
                  {uploadError ? <p className="mb-2 text-sm text-red-600">{uploadError}</p> : null}
                  <Button type="button" size="sm" onClick={handleUpload} disabled={!file || uploading}>
                    {uploading ? "Mengunggah..." : "Kirim Bukti Pembayaran"}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        <Link href="/collections/knives">
          <Button>{expired && needsPayment ? "Buat Pesanan Baru" : "Lanjut Belanja"}</Button>
        </Link>
      </Container>
    </section>
  );
}
