"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createSitePromo,
  deleteSitePromo,
  listSitePromos,
  updateSitePromo,
  type SitePromoItem,
  type SitePromoInput,
} from "@/entities/site-promo/api/site-promo.api";
import { listProducts, type ProductApiItem } from "@/entities/product/api/product.api";
import { uploadImage } from "@/shared/api/upload.api";

type ModalMode = "closed" | "add" | "edit" | "delete";

interface FormState {
  title: string;
  description: string;
  discount_percent: number;
  popup_image: string;
  apply_to_all: boolean;
  product_ids: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const emptyForm: FormState = {
  title: "",
  description: "",
  discount_percent: 25,
  popup_image: "",
  apply_to_all: true,
  product_ids: [],
  start_date: "",
  end_date: "",
  is_active: true,
};

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function promoStatus(p: SitePromoItem): "active" | "scheduled" | "expired" | "disabled" {
  if (!p.is_active) return "disabled";
  const today = new Date().toISOString().slice(0, 10);
  if (p.start_date > today) return "scheduled";
  if (p.end_date < today) return "expired";
  return "active";
}

function statusStyle(s: ReturnType<typeof promoStatus>) {
  switch (s) {
    case "active": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "scheduled": return "bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400";
    case "expired": return "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400";
    case "disabled": return "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500";
  }
}

export default function SitePromosPage() {
  const [promos, setPromos] = useState<SitePromoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedId, setSelectedId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [allProducts, setAllProducts] = useState<ProductApiItem[]>([]);
  const [productSearch, setProductSearch] = useState("");

  const loadPromos = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listSitePromos();
      setPromos(items ?? []);
    } catch {
      alert("Gagal memuat promo");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPromos(); }, [loadPromos]);

  useEffect(() => {
    if (modal === "add" || modal === "edit") {
      listProducts({ perPage: 200 }).then((items) => setAllProducts(items ?? [])).catch(() => {});
    }
  }, [modal]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleAdd = () => {
    setForm({ ...emptyForm, start_date: new Date().toISOString().slice(0, 10) });
    setImageFile(null);
    setImagePreview("");
    setModal("add");
  };

  const handleEdit = (p: SitePromoItem) => {
    setSelectedId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? "",
      discount_percent: p.discount_percent,
      popup_image: p.popup_image ?? "",
      apply_to_all: p.apply_to_all,
      product_ids: p.product_ids ?? [],
      start_date: p.start_date,
      end_date: p.end_date,
      is_active: p.is_active,
    });
    setImageFile(null);
    setImagePreview(p.popup_image ?? "");
    setModal("edit");
  };

  const handleDelete = (p: SitePromoItem) => {
    setSelectedId(p.id);
    setForm({ ...emptyForm, title: p.title });
    setModal("delete");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title || !form.start_date || !form.end_date) {
      alert("Title, tanggal mulai, dan tanggal selesai wajib diisi");
      return;
    }
    setSaving(true);
    try {
      let popupImage = form.popup_image;
      if (imageFile) {
        const url = await uploadImage(imageFile);
        popupImage = url;
      }

      const input: SitePromoInput = {
        title: form.title,
        description: form.description || undefined,
        discount_percent: form.discount_percent,
        popup_image: popupImage || undefined,
        apply_to_all: form.apply_to_all,
        product_ids: form.apply_to_all ? [] : form.product_ids,
        start_date: form.start_date,
        end_date: form.end_date,
        is_active: form.is_active,
      };

      if (modal === "add") {
        await createSitePromo(input);
        showSuccess("Promo berhasil dibuat");
      } else {
        await updateSitePromo(selectedId, input);
        showSuccess("Promo berhasil diupdate");
      }
      setModal("closed");
      loadPromos();
    } catch {
      alert("Gagal menyimpan promo");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setSaving(true);
    try {
      await deleteSitePromo(selectedId);
      showSuccess("Promo berhasil dihapus");
      setModal("closed");
      loadPromos();
    } catch {
      alert("Gagal menghapus promo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Promo</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola promo diskon otomatis untuk seluruh produk</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
          Tambah Promo
        </button>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <th className="px-6 py-3">Promo</th>
                <th className="px-6 py-3">Diskon</th>
                <th className="px-6 py-3">Target</th>
                <th className="px-6 py-3">Periode</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Popup Image</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : promos.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Belum ada promo</td></tr>
              ) : promos.map((p) => {
                const status = promoStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{p.title}</div>
                      {p.description && <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{p.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-emerald-600">{p.discount_percent}%</span>
                    </td>
                    <td className="px-6 py-4">
                      {p.apply_to_all ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Semua produk</span>
                      ) : (
                        <span className="text-xs text-blue-600 dark:text-blue-400">{p.product_ids?.length ?? 0} produk</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {formatDate(p.start_date)} — {formatDate(p.end_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.popup_image ? (
                        <img src={p.popup_image} alt="" className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(p)} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" />
          <div className="fixed inset-0 z-[51] flex items-center justify-center p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {modal === "add" ? "Tambah Promo Baru" : "Edit Promo"}
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Promo</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Diskon Kemerdekaan 17 Agustus"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi (opsional)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Diskon (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.discount_percent}
                    onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={form.end_date}
                      onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Popup Image (opsional)</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-32 rounded-lg object-contain" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="promo-active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="promo-active" className="text-sm text-gray-700 dark:text-gray-300">Aktif</label>
                </div>

                {/* Apply to all or specific products */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Berlaku Untuk</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        checked={form.apply_to_all}
                        onChange={() => setForm({ ...form, apply_to_all: true })}
                        className="h-4 w-4"
                      />
                      Semua Produk
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        checked={!form.apply_to_all}
                        onChange={() => setForm({ ...form, apply_to_all: false })}
                        className="h-4 w-4"
                      />
                      Produk Tertentu
                    </label>
                  </div>
                </div>

                {/* Product selector */}
                {!form.apply_to_all && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pilih Produk ({form.product_ids.length} dipilih)
                    </label>
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                      {allProducts
                        .filter((p) => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()))
                        .map((p) => {
                          const checked = form.product_ids.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${checked ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    product_ids: checked
                                      ? prev.product_ids.filter((id) => id !== p.id)
                                      : [...prev.product_ids, p.id],
                                  }));
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <div className="flex items-center gap-2 overflow-hidden">
                                {p.image && <img src={p.image} alt="" className="h-8 w-8 rounded object-cover" />}
                                <div className="min-w-0">
                                  <div className="truncate font-medium text-gray-900 dark:text-white">{p.name}</div>
                                  <div className="text-xs text-gray-400">Rp{p.price.toLocaleString("id-ID")}</div>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      {allProducts.length === 0 && (
                        <p className="px-3 py-4 text-center text-xs text-gray-400">Loading produk...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setModal("closed")}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation */}
      {modal === "delete" && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" />
          <div className="fixed inset-0 z-[51] flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Promo</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Yakin ingin menghapus promo &quot;{form.title}&quot;?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                  Batal
                </button>
                <button onClick={handleConfirmDelete} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                  {saving ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
