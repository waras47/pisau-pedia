"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { HttpError } from "@/shared/api/http-error";

import {
  getOrder,
  getOrderStatusCounts,
  listOrders,
  type OrderResponse,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/entities/order/api/order.api";
import {
  orderStatusLabel as statusLabel,
  orderStatusOptions,
  orderStatusStyle as statusStyle,
  paymentStatusOptions,
  paymentStyle,
} from "@/entities/order/model/order-status";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const statusIcons: Record<string, string> = {
  pending: "🕐",
  processing: "⚙️",
  ready_for_delivery: "📋",
  delivered: "✅",
  cancelled: "❌",
};

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") ?? "";

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<OrderResponse | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  async function loadOrders() {
    setLoading(true);
    try {
      const items = await listOrders({ status: statusFilter || undefined });
      setOrders(items);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  }

  async function loadStatusCounts() {
    try {
      setStatusCounts(await getOrderStatusCounts());
    } catch {
      // Stat cards are supplementary — a failure here shouldn't block the table.
    }
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    loadStatusCounts();
  }, []);

  async function openDetail(id: string) {
    try {
      const order = await getOrder(id);
      setDetail(order);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat detail pesanan");
    }
  }

  async function handleStatusChange(id: string, status: string) {
    setSaving(true);
    try {
      await updateOrderStatus(id, status);
      await Promise.all([loadOrders(), loadStatusCounts()]);
      if (detail?.id === id) setDetail((d) => (d ? { ...d, status } : d));
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengubah status pesanan");
    } finally {
      setSaving(false);
    }
  }

  async function handlePaymentStatusChange(id: string, paymentStatus: string) {
    setSaving(true);
    try {
      await updatePaymentStatus(id, paymentStatus);
      await loadOrders();
      if (detail?.id === id) setDetail((d) => (d ? { ...d, payment_status: paymentStatus } : d));
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengubah status pembayaran");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-400">
          {statusFilter ? `Menampilkan status: ${statusLabel(statusFilter)}` : "Semua pesanan customer"}
          {" · "}
          {orders.length} pesanan
        </p>
      </div>

      {/* Status stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {orderStatusOptions.map((o) => (
          <Link
            key={o.value}
            href={`/admin/orders?status=${o.value}`}
            className={`flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 ${
              statusFilter === o.value ? "ring-2 ring-emerald-400" : ""
            }`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${statusStyle(o.value)}`}>
              {statusIcons[o.value] ?? "●"}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">{statusCounts[o.value] ?? "—"}</p>
              <p className="text-[11px] text-gray-400">{o.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Order</th>
                <th className="px-4 py-4 font-medium">Customer</th>
                <th className="px-4 py-4 font-medium">Total</th>
                <th className="px-4 py-4 font-medium">Pembayaran</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Tanggal</th>
                <th className="px-4 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Memuat...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Belum ada pesanan.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-700">{o.customer_name}</p>
                      <p className="text-[11px] text-gray-400">{o.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{formatRupiah(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${paymentStyle(o.payment_status)}`}>
                        {paymentStatusOptions.find((p) => p.value === o.payment_status)?.label ?? o.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle(o.status)}`}>
                        {statusLabel(o.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(o.id)}
                        className="rounded px-2 py-1.5 text-xs font-medium text-emerald-500 hover:underline"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetail(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Order #{detail.id.slice(0, 8)}</h2>
              <button type="button" onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Customer</p>
                  <p className="font-medium text-gray-700">{detail.customer_name}</p>
                  <p className="text-xs text-gray-500">{detail.customer_email}</p>
                  {detail.customer_phone ? <p className="text-xs text-gray-500">{detail.customer_phone}</p> : null}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Alamat Pengiriman</p>
                  <p className="text-sm text-gray-700">
                    {detail.shipping_address}, {detail.shipping_city}
                    {detail.shipping_province ? `, ${detail.shipping_province}` : ""} {detail.shipping_postal_code}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status Pesanan</label>
                  <select
                    value={detail.status}
                    onChange={(e) => handleStatusChange(detail.id, e.target.value)}
                    disabled={saving}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {orderStatusOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status Pembayaran</label>
                  <select
                    value={detail.payment_status}
                    onChange={(e) => handlePaymentStatusChange(detail.id, e.target.value)}
                    disabled={saving}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {paymentStatusOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Item Pesanan</p>
                {(detail.items ?? []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-50 py-2 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">{item.product_name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} × {formatRupiah(item.price)}</p>
                    </div>
                    <p className="font-medium text-gray-700">{formatRupiah(item.subtotal)}</p>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between text-sm font-semibold text-gray-800">
                  <span>Total</span>
                  <span>{formatRupiah(detail.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
