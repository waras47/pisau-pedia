"use client";

import { useEffect, useState } from "react";

import {
  deleteReview,
  listReviews,
  updateReviewStatus,
  type ReviewApiItem,
  type ReviewStatus,
} from "@/entities/review/api/review.api";
import { HttpError } from "@/shared/api/http-error";

const statusOptions: { value: ReviewStatus; label: string }[] = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

function statusLabel(value: string) {
  return statusOptions.find((o) => o.value === value)?.label ?? value;
}

function statusStyle(value: string) {
  switch (value) {
    case "approved":
      return "bg-emerald-50 text-emerald-600";
    case "rejected":
      return "bg-red-50 text-red-500";
    default:
      return "bg-amber-50 text-amber-600";
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400">
      {"★".repeat(rating)}
      <span className="text-gray-200">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewApiItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  async function loadReviews() {
    setLoading(true);
    try {
      const items = await listReviews(statusFilter || undefined);
      setReviews(items);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat review");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleStatusChange(id: string, status: ReviewStatus) {
    setSaving(id);
    try {
      await updateReviewStatus(id, status);
      await loadReviews();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengubah status review");
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus review ini?")) return;
    setSaving(id);
    try {
      await deleteReview(id);
      await loadReviews();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus review");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
          <p className="text-sm text-gray-400">Moderasi review produk dari customer</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
        >
          <option value="">Semua Status</option>
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Produk</th>
                <th className="px-4 py-4 font-medium">Customer</th>
                <th className="px-4 py-4 font-medium">Rating</th>
                <th className="px-4 py-4 font-medium">Review</th>
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
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Belum ada review.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-700">{r.product_name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-700">{r.customer_name}</p>
                      {r.customer_email ? <p className="text-[11px] text-gray-400">{r.customer_email}</p> : null}
                    </td>
                    <td className="px-4 py-3"><Stars rating={r.rating} /></td>
                    <td className="max-w-xs px-4 py-3 text-gray-500">
                      <p className="truncate">{r.content}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle(r.status)}`}>
                        {statusLabel(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {r.status !== "approved" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(r.id, "approved")}
                            disabled={saving === r.id}
                            className="rounded px-2 py-1.5 text-xs font-medium text-emerald-500 hover:underline disabled:opacity-40"
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== "rejected" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(r.id, "rejected")}
                            disabled={saving === r.id}
                            className="rounded px-2 py-1.5 text-xs font-medium text-amber-600 hover:underline disabled:opacity-40"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          disabled={saving === r.id}
                          className="rounded px-2 py-1.5 text-xs font-medium text-red-500 hover:underline disabled:opacity-40"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
