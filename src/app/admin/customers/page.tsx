"use client";

import { useEffect, useState } from "react";

import { HttpError } from "@/shared/api/http-error";

import {
  type AddressApiItem,
  type CustomerResponse,
  getCustomer,
  getCustomerAddresses,
  listCustomers,
  updateCustomerStatus,
} from "@/entities/customer/api/customer.api";
import { listOrders, type OrderResponse } from "@/entities/order/api/order.api";
import { orderStatusStyle } from "@/entities/order/model/order-status";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [detail, setDetail] = useState<CustomerResponse | null>(null);
  const [detailOrders, setDetailOrders] = useState<OrderResponse[]>([]);
  const [detailAddresses, setDetailAddresses] = useState<AddressApiItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  async function loadCustomers() {
    setLoading(true);
    try {
      const items = await listCustomers(search || undefined);
      setCustomers(items);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat data customer");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleStatus(customer: CustomerResponse) {
    setSaving(customer.id);
    try {
      await updateCustomerStatus(customer.id, !customer.is_active);
      await loadCustomers();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengubah status customer");
    } finally {
      setSaving(null);
    }
  }

  async function openDetail(id: string) {
    setDetailLoading(true);
    try {
      const customer = await getCustomer(id);
      const [orders, addresses] = await Promise.all([
        listOrders({ customerEmail: customer.email }),
        getCustomerAddresses(id),
      ]);
      setDetail(customer);
      setDetailOrders(orders);
      setDetailAddresses(addresses);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat detail customer");
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetail(null);
    setDetailOrders([]);
    setDetailAddresses([]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-sm text-gray-400">Kelola akun customer</p>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadCustomers()}
          placeholder="Cari nama atau email..."
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={loadCustomers}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          Cari
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Customer</th>
                <th className="px-4 py-4 font-medium">Bergabung</th>
                <th className="px-4 py-4 font-medium">Jumlah Order</th>
                <th className="px-4 py-4 font-medium">Total Belanja</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    Memuat...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    Belum ada customer.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-700">{c.full_name}</p>
                      <p className="text-[11px] text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3 text-gray-500">{c.order_count}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{formatRupiah(c.total_spent)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          c.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                        }`}
                      >
                        {c.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(c.id)}
                        className="rounded px-2 py-1.5 text-xs font-medium text-gray-500 hover:underline"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c)}
                        disabled={saving === c.id}
                        className="rounded px-2 py-1.5 text-xs font-medium text-emerald-500 hover:underline disabled:opacity-40"
                      >
                        {saving === c.id ? "..." : c.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {(detail || detailLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeDetail}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Detail Customer</h2>
              <button type="button" onClick={closeDetail} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {detailLoading || !detail ? (
              <div className="px-6 py-12 text-center text-gray-400">Memuat...</div>
            ) : (
              <div className="flex flex-col gap-6 p-6">
                {/* Profile */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{detail.full_name}</p>
                    <p className="text-sm text-gray-500">{detail.email}</p>
                    {detail.phone ? <p className="text-sm text-gray-500">{detail.phone}</p> : null}
                    <p className="mt-1 text-xs text-gray-400">Bergabung {formatDate(detail.created_at)}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      detail.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    }`}
                  >
                    {detail.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-700">{detail.order_count}</p>
                    <p className="text-[11px] text-gray-400">Jumlah Order</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-700">{formatRupiah(detail.total_spent)}</p>
                    <p className="text-[11px] text-gray-400">Total Belanja</p>
                  </div>
                </div>

                {/* Order history */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Riwayat Order</p>
                  {detailOrders.length === 0 ? (
                    <p className="text-sm text-gray-400">Belum ada order.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {detailOrders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">#{o.id.slice(0, 8)}</p>
                            <p className="text-xs text-gray-400">{formatDate(o.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${orderStatusStyle(o.status)}`}>
                              {o.status.replace(/_/g, " ")}
                            </span>
                            <span className="font-medium text-gray-700">{formatRupiah(o.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Addresses */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Alamat</p>
                  {detailAddresses.length === 0 ? (
                    <p className="text-sm text-gray-400">Belum ada alamat tersimpan.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {detailAddresses.map((a) => (
                        <div key={a.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-700">{a.label || "Alamat"}</p>
                            {a.is_default ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                                Default
                              </span>
                            ) : null}
                          </div>
                          <p className="text-gray-500">{a.full_name}{a.phone ? ` · ${a.phone}` : ""}</p>
                          <p className="text-gray-500">
                            {a.address_line}, {a.city}
                            {a.province ? `, ${a.province}` : ""} {a.postal_code}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
