"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { paymentConfig } from "@/shared/config/payment.config";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

import { getPublicOrder, type OrderResponse,uploadPaymentProof } from "@/entities/order/api/order.api";

import { useCart } from "@/features/cart";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
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

  return (
    <section className="py-24">
      <Container className="flex max-w-lg flex-col items-center gap-4 text-center">
        <CheckCircle2 size={56} className="text-green-600" />
        <h1 className="font-display text-3xl font-semibold tracking-tightest">
          Terima kasih atas pesanan Anda
        </h1>
        <p className="text-muted-foreground">
          {order
            ? `Pesanan #${order.id.slice(0, 8)} berhasil dibuat. Selesaikan pembayaran sesuai instruksi di bawah, lalu unggah bukti transfer.`
            : "Pesanan Anda berhasil dibuat."}
        </p>

        {needsPayment && (
          <div className="mt-4 w-full rounded-lg border border-border bg-surface p-6 text-left">
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
          <Button>Lanjut Belanja</Button>
        </Link>
      </Container>
    </section>
  );
}
