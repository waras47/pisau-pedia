"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/shared/api/client";
import { HttpError } from "@/shared/api/http-error";
import { uploadImage } from "@/shared/api/upload.api";

interface CategoryApi {
  id: string;
  slug: string;
  name: { id: string; en: string };
}

interface PostApi {
  id: string;
  slug: string;
  category_slug: string;
  category_name: string;
  title: { id: string; en: string };
  excerpt: { id: string; en: string };
  content: { id: string; en: string };
  image: string;
  reading_minutes: number;
  status: string;
  published_at: string | null;
  created_at: string;
}

type ModalMode = "closed" | "add" | "edit";

interface PostForm {
  id: string;
  slug: string;
  category_id: string;
  title_id: string;
  title_en: string;
  excerpt_id: string;
  excerpt_en: string;
  content_id: string;
  content_en: string;
  image: string;
  reading_minutes: number;
  status: string;
}

const emptyForm: PostForm = {
  id: "",
  slug: "",
  category_id: "",
  title_id: "",
  title_en: "",
  excerpt_id: "",
  excerpt_en: "",
  content_id: "",
  content_en: "",
  image: "",
  reading_minutes: 5,
  status: "draft",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function statusStyle(value: string) {
  switch (value) {
    case "published":
      return "bg-emerald-50 text-emerald-600";
    default:
      return "bg-amber-50 text-amber-600";
  }
}

function statusLabel(value: string) {
  switch (value) {
    case "published":
      return "Published";
    default:
      return "Draft";
  }
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostApi[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modal, setModal] = useState<ModalMode>("closed");
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [modalSaving, setModalSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      params.set("per_page", "50");
      const qs = params.toString();
      const items = await apiFetch<PostApi[]>(`/admin/posts${qs ? `?${qs}` : ""}`);
      setPosts(items);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    apiFetch<CategoryApi[]>("/post-categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

  function handleAdd() {
    setForm(emptyForm);
    setModal("add");
  }

  function handleEdit(p: PostApi) {
    const cat = categories.find((c) => c.slug === p.category_slug);
    setForm({
      id: p.id,
      slug: p.slug,
      category_id: cat?.id ?? "",
      title_id: p.title.id,
      title_en: p.title.en,
      excerpt_id: p.excerpt?.id ?? "",
      excerpt_en: p.excerpt?.en ?? "",
      content_id: p.content?.id ?? "",
      content_en: p.content?.en ?? "",
      image: p.image ?? "",
      reading_minutes: p.reading_minutes,
      status: p.status,
    });
    setModal("edit");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  }

  async function handleModalSave() {
    if (!form.title_id.trim() || !form.category_id) return;
    setModalSaving(true);
    try {
      const slug = form.slug.trim() || slugify(form.title_id);
      const body = JSON.stringify({
        slug,
        category_id: form.category_id,
        title_id: form.title_id,
        title_en: form.title_en,
        excerpt_id: form.excerpt_id,
        excerpt_en: form.excerpt_en,
        content_id: form.content_id,
        content_en: form.content_en,
        image: form.image,
        reading_minutes: form.reading_minutes,
        status: form.status,
      });
      if (modal === "add") {
        await apiFetch("/admin/posts", { method: "POST", body });
      } else {
        await apiFetch(`/admin/posts/${form.id}`, { method: "PATCH", body });
      }
      await loadPosts();
      setModal("closed");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menyimpan post");
    } finally {
      setModalSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus post ini?")) return;
    setActionId(id);
    try {
      await apiFetch(`/admin/posts/${id}`, { method: "DELETE" });
      await loadPosts();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus post");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
          <p className="text-sm text-gray-400">Kelola artikel blog</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name.id}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600"
          >
            + Tambah Post
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Judul (ID)</th>
                <th className="px-4 py-4 font-medium">Kategori</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium">Tanggal</th>
                <th className="px-4 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">Memuat...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">Belum ada post.</td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="max-w-xs px-4 py-3">
                      <p className="truncate font-medium text-gray-700">{p.title.id}</p>
                      <p className="truncate text-[11px] text-gray-400">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.category_name}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyle(p.status)}`}>
                        {statusLabel(p.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(p.published_at ?? p.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          disabled={actionId === p.id}
                          className="rounded px-2 py-1.5 text-xs font-medium text-blue-500 hover:underline disabled:opacity-40"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          disabled={actionId === p.id}
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
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                {modal === "add" ? "Tambah Post" : "Edit Post"}
              </h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">&#10005;</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <PostField label="Slug">
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      className="post-input"
                      placeholder="auto dari judul jika kosong"
                    />
                  </PostField>
                  <PostField label="Kategori *">
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                      className="post-input"
                    >
                      <option value="">— Pilih Kategori —</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name.id}</option>
                      ))}
                    </select>
                  </PostField>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <PostField label="Judul (ID) *">
                    <input
                      type="text"
                      value={form.title_id}
                      onChange={(e) => setForm((f) => ({ ...f, title_id: e.target.value }))}
                      className="post-input"
                    />
                  </PostField>
                  <PostField label="Judul (EN)">
                    <input
                      type="text"
                      value={form.title_en}
                      onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
                      className="post-input"
                    />
                  </PostField>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <PostField label="Excerpt (ID)">
                    <textarea
                      rows={3}
                      value={form.excerpt_id}
                      onChange={(e) => setForm((f) => ({ ...f, excerpt_id: e.target.value }))}
                      className="post-input resize-none"
                    />
                  </PostField>
                  <PostField label="Excerpt (EN)">
                    <textarea
                      rows={3}
                      value={form.excerpt_en}
                      onChange={(e) => setForm((f) => ({ ...f, excerpt_en: e.target.value }))}
                      className="post-input resize-none"
                    />
                  </PostField>
                </div>
                <PostField label="Content (ID)">
                  <textarea
                    rows={6}
                    value={form.content_id}
                    onChange={(e) => setForm((f) => ({ ...f, content_id: e.target.value }))}
                    className="post-input resize-none"
                    placeholder="Pisahkan paragraf dengan baris kosong"
                  />
                </PostField>
                <PostField label="Content (EN)">
                  <textarea
                    rows={6}
                    value={form.content_en}
                    onChange={(e) => setForm((f) => ({ ...f, content_en: e.target.value }))}
                    className="post-input resize-none"
                    placeholder="Separate paragraphs with blank lines"
                  />
                </PostField>
                <div className="grid gap-4 sm:grid-cols-3">
                  <PostField label="Gambar">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="post-input text-xs"
                    />
                    {uploading && <p className="mt-1 text-xs text-gray-400">Mengupload...</p>}
                    {form.image && (
                      <img src={form.image} alt="Preview" className="mt-2 h-20 w-auto rounded object-cover" />
                    )}
                  </PostField>
                  <PostField label="Waktu Baca (menit)">
                    <input
                      type="number"
                      min={1}
                      value={form.reading_minutes}
                      onChange={(e) => setForm((f) => ({ ...f, reading_minutes: Number(e.target.value) }))}
                      className="post-input"
                    />
                  </PostField>
                  <PostField label="Status">
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                      className="post-input"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </PostField>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Batal</button>
              <button
                type="button"
                onClick={handleModalSave}
                disabled={modalSaving || !form.title_id.trim() || !form.category_id}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
              >
                {modalSaving ? "Menyimpan..." : modal === "add" ? "Tambah Post" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .post-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          transition: border-color 0.15s;
        }
        .post-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </div>
  );
}

function PostField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}
