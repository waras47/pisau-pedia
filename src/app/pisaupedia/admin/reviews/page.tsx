"use client";

import { useEffect, useState } from "react";

import { HttpError } from "@/shared/api/http-error";

import { listProducts, type ProductApiItem } from "@/entities/product/api/product.api";
import {
  createReviewAdmin,
  deleteReview,
  listReviews,
  type ReviewApiItem,
  type ReviewStatus,
  updateReview,
  updateReviewStatus,
} from "@/entities/review/api/review.api";

type ModalMode = "closed" | "add" | "edit";

interface ReviewForm {
  id: string;
  productSlug: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  content: string;
  status: ReviewStatus;
}

const emptyForm: ReviewForm = {
  id: "",
  productSlug: "",
  customerName: "",
  customerEmail: "",
  rating: 5,
  content: "",
  status: "pending",
};

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
  const [products, setProducts] = useState<ProductApiItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [modalSaving, setModalSaving] = useState(false);

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

  useEffect(() => {
    listProducts({ perPage: 200 })
      .then(setProducts)
      .catch(() => {
        // Product dropdown is a convenience for the add form — silently
        // leave it empty rather than blocking the review list on it.
      });
  }, []);

  function handleAdd() {
    setForm(emptyForm);
    setModal("add");
  }

  function handleEdit(r: ReviewApiItem) {
    setForm({
      id: r.id,
      productSlug: r.product_slug ?? "",
      customerName: r.customer_name,
      customerEmail: r.customer_email ?? "",
      rating: r.rating,
      content: r.content,
      status: r.status,
    });
    setModal("edit");
  }

  async function handleModalSave() {
    if (!form.customerName.trim() || !form.content.trim()) return;
    setModalSaving(true);
    try {
      if (modal === "add") {
        await createReviewAdmin({
          product_slug: form.productSlug || undefined,
          customer_name: form.customerName,
          customer_email: form.customerEmail || undefined,
          rating: form.rating,
          content: form.content,
          status: form.status,
        });
      } else {
        await updateReview(form.id, {
          customer_name: form.customerName,
          customer_email: form.customerEmail || undefined,
          rating: form.rating,
          content: form.content,
          status: form.status,
        });
      }
      await loadReviews();
      setModal("closed");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menyimpan review");
    } finally {
      setModalSaving(false);
    }
  }

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
        <div className="flex items-center gap-3">
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
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600"
          >
            + Tambah Review
          </button>
        </div>
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
                          onClick={() => handleEdit(r)}
                          disabled={saving === r.id}
                          className="rounded px-2 py-1.5 text-xs font-medium text-blue-500 hover:underline disabled:opacity-40"
                        >
                          Edit
                        </button>
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

      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal("closed")}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                {modal === "add" ? "Tambah Review" : "Edit Review"}
              </h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-4">
                {modal === "add" && (
                  <ReviewField label="Produk">
                    <select
                      value={form.productSlug}
                      onChange={(e) => setForm((f) => ({ ...f, productSlug: e.target.value }))}
                      className="review-input"
                    >
                      <option value="">— Tidak ada produk (Shop Review) —</option>
                      {products.map((p) => (
                        <option key={p.slug} value={p.slug}>{p.name}</option>
                      ))}
                    </select>
                  </ReviewField>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <ReviewField label="Nama Customer *">
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                      className="review-input"
                    />
                  </ReviewField>
                  <ReviewField label="Email Customer">
                    <input
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                      className="review-input"
                      placeholder="opsional"
                    />
                  </ReviewField>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ReviewField label="Rating *">
                    <select
                      value={form.rating}
                      onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                      className="review-input"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} ★</option>
                      ))}
                    </select>
                  </ReviewField>
                  <ReviewField label="Status">
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ReviewStatus }))}
                      className="review-input"
                    >
                      {statusOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </ReviewField>
                </div>
                <ReviewField label="Isi Review *">
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    className="review-input resize-none"
                  />
                </ReviewField>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Batal</button>
              <button
                type="button"
                onClick={handleModalSave}
                disabled={modalSaving || !form.customerName.trim() || !form.content.trim() || (modal === "add" && !form.productSlug)}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
              >
                {modalSaving ? "Menyimpan..." : modal === "add" ? "Tambah Review" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .review-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          transition: border-color 0.15s;
        }
        .review-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </div>
  );
}

function ReviewField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}
