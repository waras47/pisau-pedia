"use client";

import { useEffect, useState } from "react";

import { ImageUploadField } from "@/shared/ui/ImageUploadField";
import {
  type CategoryApiItem,
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/entities/category/api/category.api";
import { listProductsByCategory } from "@/entities/product/api/product.api";
import { HttpError } from "@/shared/api/http-error";

type ModalMode = "closed" | "add" | "edit" | "delete";

interface CategoryRow extends CategoryApiItem {
  productCount: number;
}

const emptyForm = { name: "", description: "", image_url: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [active, setActive] = useState<CategoryRow | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadCategories() {
    setLoading(true);
    try {
      const items = await listCategories();
      const withCounts = await Promise.all(
        items.map(async (c) => {
          const { total } = await listProductsByCategory(c.slug, 1).catch(() => ({ total: 0 }));
          return { ...c, productCount: total };
        }),
      );
      setCategories(withCounts);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openAdd() {
    setForm(emptyForm);
    setActive(null);
    setModal("add");
  }

  function openEdit(cat: CategoryRow) {
    setForm({ name: cat.name, description: cat.description ?? "", image_url: cat.image_url ?? "" });
    setActive(cat);
    setModal("edit");
  }

  function openDelete(cat: CategoryRow) {
    setActive(cat);
    setModal("delete");
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        image_url: form.image_url || undefined,
      };
      if (modal === "add") {
        await createCategory(payload);
      } else if (active) {
        await updateCategory(active.id, payload);
      }
      await loadCategories();
      setModal("closed");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menyimpan kategori");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!active) return;
    setSaving(true);
    try {
      await deleteCategory(active.id);
      await loadCategories();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus kategori");
    } finally {
      setSaving(false);
      setModal("closed");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategori</h1>
          <p className="text-sm text-gray-400">
            Kelola kategori produk — halaman ini juga menampilkan tampilan koleksi di storefront.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
        >
          + Tambah Kategori
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Kategori</th>
                <th className="px-4 py-4 font-medium">Slug</th>
                <th className="px-4 py-4 font-medium">Jumlah Produk</th>
                <th className="px-4 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                    Memuat...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                    Belum ada kategori.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cat.image_url} alt={cat.name} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                            IMG
                          </div>
                        )}
                        <span className="font-medium text-gray-700">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.productCount} produk</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/collections/${cat.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded px-2 py-1.5 text-xs font-medium text-emerald-500 hover:underline"
                        >
                          Lihat di toko
                        </a>
                        <button
                          type="button"
                          onClick={() => openEdit(cat)}
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(cat)}
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500"
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
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                {modal === "add" ? "Tambah Kategori" : `Edit: ${active?.name}`}
              </h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nama *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="admin-input rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Misal: Gyuto"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Deskripsi</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none"
                  placeholder="Deskripsi singkat untuk halaman koleksi..."
                />
              </div>
              <ImageUploadField
                label="Gambar Kategori"
                image={form.image_url || undefined}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url ?? "" }))}
              />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setModal("closed")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
              >
                {saving ? "Menyimpan..." : modal === "add" ? "Tambah" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal("closed")}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-800">Hapus Kategori</h2>
            <p className="mt-2 text-sm text-gray-500">
              Yakin mau hapus <strong>{active.name}</strong>? Produk yang masih memakai kategori ini tidak akan ikut terhapus.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal("closed")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-40"
              >
                {saving ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
