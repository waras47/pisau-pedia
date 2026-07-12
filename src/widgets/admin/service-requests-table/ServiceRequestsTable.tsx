"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  getServiceRequest,
  listServiceRequests,
  updateServiceRequest,
  type ServiceRequestResponse,
  type ServiceRequestType,
} from "@/entities/service-request/api/service-request.api";
import { HttpError } from "@/shared/api/http-error";

const statusOptions = [
  { value: "pending", label: "Menunggu" },
  { value: "in_progress", label: "Diproses" },
  { value: "completed", label: "Selesai" },
  { value: "rejected", label: "Ditolak" },
];

function statusLabel(value: string) {
  return statusOptions.find((o) => o.value === value)?.label ?? value;
}

function statusStyle(value: string) {
  switch (value) {
    case "completed":
      return "bg-emerald-50 text-emerald-600";
    case "rejected":
      return "bg-red-50 text-red-500";
    case "in_progress":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface ServiceRequestsTableProps {
  type: ServiceRequestType;
}

export function ServiceRequestsTable({ type }: ServiceRequestsTableProps) {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") ?? "";

  const [requests, setRequests] = useState<ServiceRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<ServiceRequestResponse | null>(null);
  const [quotedPrice, setQuotedPrice] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  async function loadRequests() {
    setLoading(true);
    try {
      const items = await listServiceRequests(type, statusFilter || undefined);
      setRequests(items);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, statusFilter]);

  async function openDetail(id: string) {
    try {
      const req = await getServiceRequest(id);
      setDetail(req);
      setQuotedPrice(req.quoted_price ? String(req.quoted_price) : "");
      setAdminNotes(req.admin_notes ?? "");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat detail");
    }
  }

  async function handleStatusChange(status: string) {
    if (!detail) return;
    setSaving(true);
    try {
      const updated = await updateServiceRequest(detail.id, { status: status as ServiceRequestResponse["status"] });
      setDetail(updated);
      await loadRequests();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengubah status");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveQuote() {
    if (!detail) return;
    setSaving(true);
    try {
      const updated = await updateServiceRequest(detail.id, {
        quoted_price: quotedPrice ? Number(quotedPrice) : undefined,
        admin_notes: adminNotes || undefined,
      });
      setDetail(updated);
      await loadRequests();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menyimpan quote");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Customer</th>
                <th className="px-4 py-4 font-medium">Pesan</th>
                <th className="px-4 py-4 font-medium">Quote</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Tanggal</th>
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
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    Belum ada request.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-700">{r.customer_name}</p>
                      <p className="text-[11px] text-gray-400">{r.customer_email}</p>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-gray-500">
                      <p className="truncate">{r.message}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.quoted_price ? formatRupiah(r.quoted_price) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle(r.status)}`}>
                        {statusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(r.id)}
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
              <h2 className="text-lg font-bold text-gray-800">Request dari {detail.customer_name}</h2>
              <button type="button" onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="text-sm">
                <p className="text-xs text-gray-400">Kontak</p>
                <p className="text-gray-700">{detail.customer_email}</p>
                {detail.customer_phone ? <p className="text-gray-700">{detail.customer_phone}</p> : null}
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400">Pesan</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{detail.message}</p>
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status</label>
                <select
                  value={detail.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Quote (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Belum ada quote"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Catatan Internal</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none"
                  placeholder="Catatan buat tim internal..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSaveQuote}
                disabled={saving}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
              >
                {saving ? "Menyimpan..." : "Simpan Quote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
