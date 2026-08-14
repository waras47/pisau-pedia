"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/shared/api/client";
import { HttpError } from "@/shared/api/http-error";

interface CategoryApi {
  id: string;
  slug: string;
  name: { id: string; en: string };
  description: { id: string; en: string };
}

type ModalMode = "closed" | "add" | "edit";

interface CategoryForm {
  id: string;
  slug: string;
  name_id: string;
  name_en: string;
  desc_id: string;
  desc_en: string;
}

const emptyForm: CategoryForm = {
  id: "",
  slug: "",
  name_id: "",
  name_en: "",
  desc_id: "",
  desc_en: "",
};

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [modalSaving, setModalSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  async function loadCategories() {
    setLoading(true);
    try {
      const items = await apiFetch<CategoryApi[]>("/post-categories");
      setCategories(items);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleAdd() {
    setForm(emptyForm);
    setModal("add");
  }

  function handleEdit(c: CategoryApi) {
    setForm({
      id: c.id,
      slug: c.slug,
      name_id: c.name.id,
      name_en: c.name.en,
      desc_id: c.description.id,
      desc_en: c.description.en,
    });
    setModal("edit");
  }

  async function handleModalSave() {
    if (!form.slug.trim() || !form.name_id.trim()) return;
    setModalSaving(true);
    try {
      const body = JSON.stringify({
        slug: form.slug,
        name_id: form.name_id,
        name_en: form.name_en,
        desc_id: form.desc_id,
        desc_en: form.desc_en,
      });
      if (modal === "add") {
        await apiFetch("/admin/post-categories", { method: "POST", body });
      } else {
        await apiFetch(`/admin/post-categories/${form.id}`, { method: "PATCH", body });
      }
      await loadCategories();
      setModal("closed");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menyimpan kategori");
    } finally {
      setModalSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus kategori ini?")) return;
    setActionId(id);
    try {
      await apiFetch(`/admin/post-categories/${id}`, { method: "DELETE" });
      await loadCategories();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus kategori");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kategori Blog</h1>
          <p className="text-sm text-gray-400">Kelola kategori untuk artikel blog</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600"
        >
          + Tambah Kategori
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Slug</th>
                <th className="px-4 py-4 font-medium">Nama (ID)</th>
                <th className="px-4 py-4 font-medium">Nama (EN)</th>
                <th className="px-4 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">Memuat...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400">Belum ada kategori.</td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-700">{c.slug}</td>
                    <td className="px-4 py-3 text-gray-600">{c.name.id}</td>
                    <td className="px-4 py-3 text-gray-600">{c.name.en}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(c)}
                          disabled={actionId === c.id}
                          className="rounded px-2 py-1.5 text-xs font-medium text-blue-500 hover:underline disabled:opacity-40"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          disabled={actionId === c.id}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                {modal === "add" ? "Tambah Kategori" : "Edit Kategori"}
              </h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">&#10005;</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-4">
                <FormField label="Slug *">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className="cat-input"
                    placeholder="contoh: knife-types"
                  />
                </FormField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Nama (ID) *">
                    <input
                      type="text"
                      value={form.name_id}
                      onChange={(e) => setForm((f) => ({ ...f, name_id: e.target.value }))}
                      className="cat-input"
                    />
                  </FormField>
                  <FormField label="Nama (EN)">
                    <input
                      type="text"
                      value={form.name_en}
                      onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                      className="cat-input"
                    />
                  </FormField>
                </div>
                <FormField label="Deskripsi (ID)">
                  <textarea
                    rows={3}
                    value={form.desc_id}
                    onChange={(e) => setForm((f) => ({ ...f, desc_id: e.target.value }))}
                    className="cat-input resize-none"
                  />
                </FormField>
                <FormField label="Deskripsi (EN)">
                  <textarea
                    rows={3}
                    value={form.desc_en}
                    onChange={(e) => setForm((f) => ({ ...f, desc_en: e.target.value }))}
                    className="cat-input resize-none"
                  />
                </FormField>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Batal</button>
              <button
                type="button"
                onClick={handleModalSave}
                disabled={modalSaving || !form.slug.trim() || !form.name_id.trim()}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
              >
                {modalSaving ? "Menyimpan..." : modal === "add" ? "Tambah Kategori" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .cat-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          transition: border-color 0.15s;
        }
        .cat-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}
