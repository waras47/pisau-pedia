"use client";

import { useEffect, useState } from "react";

import {
  type CollectionApiItem,
  createCollection,
  deleteCollection,
  listCollections,
  updateCollection,
} from "@/entities/collection/api/collection.api";
import {
  type CategoryApiItem,
  listCategories,
} from "@/entities/category/api/category.api";
import { HttpError } from "@/shared/api/http-error";

type ModalMode = "closed" | "add" | "edit" | "delete";

interface FormState {
  name: string;
  description: string;
  sort_order: number;
  category_ids: string[];
}

const emptyForm: FormState = { name: "", description: "", sort_order: 0, category_ids: [] };

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionApiItem[]>([]);
  const [categories, setCategories] = useState<CategoryApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [active, setActive] = useState<CollectionApiItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  async function load() {
    setLoading(true);
    try {
      const [cols, cats] = await Promise.all([listCollections(), listCategories()]);
      setCollections(cols);
      setCategories(cats);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(emptyForm);
    setActive(null);
    setModal("add");
  }

  function openEdit(col: CollectionApiItem) {
    setForm({
      name: col.name,
      description: col.description ?? "",
      sort_order: col.sort_order,
      category_ids: col.categories.map((c) => c.id),
    });
    setActive(col);
    setModal("edit");
  }

  function openDelete(col: CollectionApiItem) {
    setActive(col);
    setModal("delete");
  }

  function toggleCategory(id: string) {
    setForm((f) => ({
      ...f,
      category_ids: f.category_ids.includes(id)
        ? f.category_ids.filter((x) => x !== id)
        : [...f.category_ids, id],
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        sort_order: form.sort_order,
        category_ids: form.category_ids,
      };
      if (modal === "add") {
        await createCollection(payload);
      } else if (active) {
        await updateCollection(active.id, payload);
      }
      await load();
      setModal("closed");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!active) return;
    setSaving(true);
    try {
      await deleteCollection(active.id);
      await load();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus");
    } finally {
      setSaving(false);
      setModal("closed");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Koleksi</h1>
          <p className="text-sm text-gray-400">
            Kelola koleksi — mengelompokkan beberapa kategori ke dalam satu halaman (misal: Multi-Purpose, Slicing & Sashimi).
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
        >
          + Tambah Koleksi
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Nama</th>
                <th className="px-4 py-4 font-medium">Slug</th>
                <th className="px-4 py-4 font-medium">Kategori</th>
                <th className="px-4 py-4 font-medium">Urutan</th>
                <th className="px-4 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Memuat...</td></tr>
              ) : collections.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Belum ada koleksi.</td></tr>
              ) : (
                collections.map((col) => (
                  <tr key={col.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-700">{col.name}</td>
                    <td className="px-4 py-3 text-gray-500">{col.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {col.categories.map((cat) => (
                          <span key={cat.id} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{col.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/collections/${col.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded px-2 py-1.5 text-xs font-medium text-emerald-500 hover:underline"
                        >
                          Lihat di toko
                        </a>
                        <button type="button" onClick={() => openEdit(col)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-500">
                          Edit
                        </button>
                        <button type="button" onClick={() => openDelete(col)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500">
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
                {modal === "add" ? "Tambah Koleksi" : `Edit: ${active?.name}`}
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
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Misal: Multi-Purpose"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Deskripsi</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none"
                  placeholder="Deskripsi singkat..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Urutan</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-24"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Kategori ({form.category_ids.length} dipilih)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 p-3">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-emerald-600">
                      <input
                        type="checkbox"
                        checked={form.category_ids.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
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
            <h2 className="text-lg font-bold text-gray-800">Hapus Koleksi</h2>
            <p className="mt-2 text-sm text-gray-500">
              Yakin mau hapus koleksi <strong>{active.name}</strong>? Kategori dan produk yang tergabung tidak akan ikut terhapus.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
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
