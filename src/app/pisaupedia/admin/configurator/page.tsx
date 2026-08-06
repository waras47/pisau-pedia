"use client";

import { useEffect, useState } from "react";

import {
  type ShapeItem, type BladeItem, type HandleItem, type AccessoryItem,
  listShapes, createShape, updateShape, deleteShape,
  listBlades, createBlade, updateBlade, deleteBlade,
  listHandles, createHandle, updateHandle, deleteHandle,
  listAccessories, createAccessory, updateAccessory, deleteAccessory,
  uploadImage,
} from "@/entities/configurator/api/configurator-admin.api";
import { HttpError } from "@/shared/api/http-error";

type Tab = "shapes" | "blades" | "handles" | "accessories";
type ModalMode = "closed" | "add" | "edit" | "delete";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

// ─── Shape Form ───

interface ShapeForm { name: string; category: string; description: string; image_url: string; sort_order: number }
const emptyShapeForm: ShapeForm = { name: "", category: "Multi-Purpose", description: "", image_url: "", sort_order: 0 };

function ShapePanel() {
  const [items, setItems] = useState<ShapeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [active, setActive] = useState<ShapeItem | null>(null);
  const [form, setForm] = useState<ShapeForm>(emptyShapeForm);

  async function load() {
    setLoading(true);
    try { setItems(await listShapes()); } catch { /* */ }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(emptyShapeForm); setActive(null); setModal("add"); }
  function openEdit(s: ShapeItem) {
    setForm({ name: s.name, category: s.category, description: s.description ?? "", image_url: s.image_url ?? "", sort_order: s.sort_order });
    setActive(s); setModal("edit");
  }
  function openDelete(s: ShapeItem) { setActive(s); setModal("delete"); }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: form.name, category: form.category, description: form.description || undefined, image_url: form.image_url || undefined, sort_order: form.sort_order };
      if (modal === "add") await createShape(payload as Omit<ShapeItem, "id">);
      else if (active) await updateShape(active.id, payload);
      await load(); setModal("closed");
    } catch (err) { alert(err instanceof HttpError ? err.message : "Gagal menyimpan"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!active) return;
    setSaving(true);
    try { await deleteShape(active.id); await load(); }
    catch (err) { alert(err instanceof HttpError ? err.message : "Gagal menghapus"); }
    finally { setSaving(false); setModal("closed"); }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{items.length} bentuk pisau</p>
        <button type="button" onClick={openAdd} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">+ Tambah Shape</button>
      </div>
      <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-xs text-gray-400">
            <th className="px-4 py-3 font-medium">Gambar</th>
            <th className="px-4 py-3 font-medium">Nama</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Urutan</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Memuat...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Belum ada shape.</td></tr>
            ) : items.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3">{s.image_url ? <img src={s.image_url} alt={s.name} className="h-10 w-16 rounded object-contain bg-gray-100" /> : <div className="h-10 w-16 rounded bg-gray-100" />}</td>
                <td className="px-4 py-3 font-medium text-gray-700">{s.name}</td>
                <td className="px-4 py-3 text-gray-500">{s.category}</td>
                <td className="px-4 py-3 text-gray-500">{s.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => openEdit(s)} className="rounded px-2 py-1 text-xs text-gray-400 hover:text-emerald-500">Edit</button>
                  <button type="button" onClick={() => openDelete(s)} className="rounded px-2 py-1 text-xs text-gray-400 hover:text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal("closed")}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">{modal === "add" ? "Tambah Shape" : `Edit: ${active?.name}`}</h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <Field label="Nama *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <Field label="Kategori" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} placeholder="Multi-Purpose" />
              <Field label="Deskripsi" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} textarea />
              <ImageUpload value={form.image_url} onChange={(v) => setForm((f) => ({ ...f, image_url: v }))} />
              <NumField label="Urutan" value={form.sort_order} onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))} />
            </div>
            <ModalFooter saving={saving} disabled={!form.name.trim()} onCancel={() => setModal("closed")} onSave={handleSave} label={modal === "add" ? "Tambah" : "Simpan"} />
          </div>
        </div>
      )}
      {modal === "delete" && active && <DeleteModal name={active.name} saving={saving} onCancel={() => setModal("closed")} onDelete={handleDelete} />}
    </>
  );
}

// ─── Blade Panel ───

interface BladeForm { shape_id: string; name: string; steel: string; length_mm: number; price: number; compare_at_price: string; description: string; image_url: string; sort_order: number; specifications: string }
const emptyBladeForm: BladeForm = { shape_id: "", name: "", steel: "", length_mm: 0, price: 0, compare_at_price: "", description: "", image_url: "", sort_order: 0, specifications: "" };

function BladePanel() {
  const [items, setItems] = useState<BladeItem[]>([]);
  const [shapes, setShapes] = useState<ShapeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [active, setActive] = useState<BladeItem | null>(null);
  const [form, setForm] = useState<BladeForm>(emptyBladeForm);

  async function load() {
    setLoading(true);
    try {
      const [b, s] = await Promise.all([listBlades(), listShapes()]);
      setItems(b); setShapes(s);
    } catch { /* */ }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setForm({ ...emptyBladeForm, shape_id: shapes[0]?.id ?? "" }); setActive(null); setModal("add"); }
  function openEdit(b: BladeItem) {
    setForm({
      shape_id: b.shape_id, name: b.name, steel: b.steel, length_mm: b.length_mm, price: b.price,
      compare_at_price: b.compare_at_price?.toString() ?? "", description: b.description ?? "",
      image_url: b.image_url ?? "", sort_order: b.sort_order,
      specifications: b.specifications ? Object.entries(b.specifications).map(([k, v]) => `${k}: ${v}`).join("\n") : "",
    });
    setActive(b); setModal("edit");
  }

  function parseSpecs(text: string): Record<string, string> | undefined {
    if (!text.trim()) return undefined;
    const out: Record<string, string> = {};
    for (const line of text.split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) out[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
    return Object.keys(out).length > 0 ? out : undefined;
  }

  async function handleSave() {
    if (!form.name.trim() || !form.shape_id) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        shape_id: form.shape_id, name: form.name, steel: form.steel, length_mm: form.length_mm,
        price: form.price, description: form.description || undefined,
        image_url: form.image_url || undefined, sort_order: form.sort_order,
        specifications: parseSpecs(form.specifications),
      };
      if (form.compare_at_price) payload.compare_at_price = parseFloat(form.compare_at_price);
      if (modal === "add") await createBlade(payload as Omit<BladeItem, "id">);
      else if (active) await updateBlade(active.id, payload);
      await load(); setModal("closed");
    } catch (err) { alert(err instanceof HttpError ? err.message : "Gagal menyimpan"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!active) return;
    setSaving(true);
    try { await deleteBlade(active.id); await load(); }
    catch (err) { alert(err instanceof HttpError ? err.message : "Gagal menghapus"); }
    finally { setSaving(false); setModal("closed"); }
  }

  const shapeName = (id: string) => shapes.find((s) => s.id === id)?.name ?? id.slice(0, 8);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{items.length} blade</p>
        <button type="button" onClick={openAdd} disabled={shapes.length === 0} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40">+ Tambah Blade</button>
      </div>
      <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-xs text-gray-400">
            <th className="px-4 py-3 font-medium">Gambar</th>
            <th className="px-4 py-3 font-medium">Nama</th>
            <th className="px-4 py-3 font-medium">Shape</th>
            <th className="px-4 py-3 font-medium">Baja</th>
            <th className="px-4 py-3 font-medium">Panjang</th>
            <th className="px-4 py-3 font-medium">Harga</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Memuat...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Belum ada blade. {shapes.length === 0 && "Tambah shape terlebih dahulu."}</td></tr>
            ) : items.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3">{b.image_url ? <img src={b.image_url} alt={b.name} className="h-10 w-16 rounded object-contain bg-gray-100" /> : <div className="h-10 w-16 rounded bg-gray-100" />}</td>
                <td className="px-4 py-3 font-medium text-gray-700">{b.name}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{shapeName(b.shape_id)}</span></td>
                <td className="px-4 py-3 text-gray-500">{b.steel}</td>
                <td className="px-4 py-3 text-gray-500">{b.length_mm}mm</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{formatRupiah(b.price)}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => openEdit(b)} className="rounded px-2 py-1 text-xs text-gray-400 hover:text-emerald-500">Edit</button>
                  <button type="button" onClick={() => { setActive(b); setModal("delete"); }} className="rounded px-2 py-1 text-xs text-gray-400 hover:text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal("closed")}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">{modal === "add" ? "Tambah Blade" : `Edit: ${active?.name}`}</h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Shape *</label>
                <select value={form.shape_id} onChange={(e) => setForm((f) => ({ ...f, shape_id: e.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  {shapes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <Field label="Nama *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <Field label="Baja (Steel) *" value={form.steel} onChange={(v) => setForm((f) => ({ ...f, steel: v }))} placeholder="Aogami #2" />
              <div className="grid grid-cols-2 gap-4">
                <NumField label="Panjang (mm)" value={form.length_mm} onChange={(v) => setForm((f) => ({ ...f, length_mm: v }))} />
                <NumField label="Harga (Rp)" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
              </div>
              <Field label="Harga Coret (opsional)" value={form.compare_at_price} onChange={(v) => setForm((f) => ({ ...f, compare_at_price: v }))} placeholder="0" />
              <Field label="Deskripsi" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} textarea />
              <Field label="Spesifikasi (Key: Value per baris)" value={form.specifications} onChange={(v) => setForm((f) => ({ ...f, specifications: v }))} textarea placeholder={"Steel: Aogami #2\nLength: 210mm\nHardness: 62-63 HRC"} />
              <ImageUpload value={form.image_url} onChange={(v) => setForm((f) => ({ ...f, image_url: v }))} />
              <NumField label="Urutan" value={form.sort_order} onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))} />
            </div>
            <ModalFooter saving={saving} disabled={!form.name.trim() || !form.shape_id} onCancel={() => setModal("closed")} onSave={handleSave} label={modal === "add" ? "Tambah" : "Simpan"} />
          </div>
        </div>
      )}
      {modal === "delete" && active && <DeleteModal name={active.name} saving={saving} onCancel={() => setModal("closed")} onDelete={handleDelete} />}
    </>
  );
}

// ─── Handle Panel ───

interface HandleForm { name: string; material: string; price_delta: number; image_url: string; sort_order: number }
const emptyHandleForm: HandleForm = { name: "", material: "", price_delta: 0, image_url: "", sort_order: 0 };

function HandlePanel() {
  const [items, setItems] = useState<HandleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [active, setActive] = useState<HandleItem | null>(null);
  const [form, setForm] = useState<HandleForm>(emptyHandleForm);

  async function load() {
    setLoading(true);
    try { setItems(await listHandles()); } catch { /* */ }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(emptyHandleForm); setActive(null); setModal("add"); }
  function openEdit(h: HandleItem) {
    setForm({ name: h.name, material: h.material, price_delta: h.price_delta, image_url: h.image_url ?? "", sort_order: h.sort_order });
    setActive(h); setModal("edit");
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: form.name, material: form.material, price_delta: form.price_delta, image_url: form.image_url || undefined, sort_order: form.sort_order };
      if (modal === "add") await createHandle(payload as Omit<HandleItem, "id">);
      else if (active) await updateHandle(active.id, payload);
      await load(); setModal("closed");
    } catch (err) { alert(err instanceof HttpError ? err.message : "Gagal menyimpan"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!active) return;
    setSaving(true);
    try { await deleteHandle(active.id); await load(); }
    catch (err) { alert(err instanceof HttpError ? err.message : "Gagal menghapus"); }
    finally { setSaving(false); setModal("closed"); }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{items.length} handle</p>
        <button type="button" onClick={openAdd} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">+ Tambah Handle</button>
      </div>
      <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-xs text-gray-400">
            <th className="px-4 py-3 font-medium">Gambar</th>
            <th className="px-4 py-3 font-medium">Nama</th>
            <th className="px-4 py-3 font-medium">Material</th>
            <th className="px-4 py-3 font-medium">Tambahan Harga</th>
            <th className="px-4 py-3 font-medium">Urutan</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Memuat...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Belum ada handle.</td></tr>
            ) : items.map((h) => (
              <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3">{h.image_url ? <img src={h.image_url} alt={h.name} className="h-10 w-16 rounded object-contain bg-gray-100" /> : <div className="h-10 w-16 rounded bg-gray-100" />}</td>
                <td className="px-4 py-3 font-medium text-gray-700">{h.name}</td>
                <td className="px-4 py-3 text-gray-500">{h.material}</td>
                <td className="px-4 py-3 text-gray-700">{h.price_delta === 0 ? "Dasar" : `+${formatRupiah(h.price_delta)}`}</td>
                <td className="px-4 py-3 text-gray-500">{h.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => openEdit(h)} className="rounded px-2 py-1 text-xs text-gray-400 hover:text-emerald-500">Edit</button>
                  <button type="button" onClick={() => { setActive(h); setModal("delete"); }} className="rounded px-2 py-1 text-xs text-gray-400 hover:text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal("closed")}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">{modal === "add" ? "Tambah Handle" : `Edit: ${active?.name}`}</h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <Field label="Nama *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <Field label="Material *" value={form.material} onChange={(v) => setForm((f) => ({ ...f, material: v }))} placeholder="Magnolia wood" />
              <NumField label="Tambahan Harga (Rp)" value={form.price_delta} onChange={(v) => setForm((f) => ({ ...f, price_delta: v }))} />
              <ImageUpload value={form.image_url} onChange={(v) => setForm((f) => ({ ...f, image_url: v }))} />
              <NumField label="Urutan" value={form.sort_order} onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))} />
            </div>
            <ModalFooter saving={saving} disabled={!form.name.trim()} onCancel={() => setModal("closed")} onSave={handleSave} label={modal === "add" ? "Tambah" : "Simpan"} />
          </div>
        </div>
      )}
      {modal === "delete" && active && <DeleteModal name={active.name} saving={saving} onCancel={() => setModal("closed")} onDelete={handleDelete} />}
    </>
  );
}

// ─── Accessory Panel ───

interface AccessoryForm { name: string; price: number; image_url: string; sort_order: number }
const emptyAccessoryForm: AccessoryForm = { name: "", price: 0, image_url: "", sort_order: 0 };

function AccessoryPanel() {
  const [items, setItems] = useState<AccessoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [active, setActive] = useState<AccessoryItem | null>(null);
  const [form, setForm] = useState<AccessoryForm>(emptyAccessoryForm);

  async function load() {
    setLoading(true);
    try { setItems(await listAccessories()); } catch { /* */ }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setForm(emptyAccessoryForm); setActive(null); setModal("add"); }
  function openEdit(a: AccessoryItem) {
    setForm({ name: a.name, price: a.price, image_url: a.image_url ?? "", sort_order: a.sort_order });
    setActive(a); setModal("edit");
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { name: form.name, price: form.price, image_url: form.image_url || undefined, sort_order: form.sort_order };
      if (modal === "add") await createAccessory(payload as Omit<AccessoryItem, "id">);
      else if (active) await updateAccessory(active.id, payload);
      await load(); setModal("closed");
    } catch (err) { alert(err instanceof HttpError ? err.message : "Gagal menyimpan"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!active) return;
    setSaving(true);
    try { await deleteAccessory(active.id); await load(); }
    catch (err) { alert(err instanceof HttpError ? err.message : "Gagal menghapus"); }
    finally { setSaving(false); setModal("closed"); }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{items.length} aksesori</p>
        <button type="button" onClick={openAdd} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">+ Tambah Aksesori</button>
      </div>
      <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-xs text-gray-400">
            <th className="px-4 py-3 font-medium">Gambar</th>
            <th className="px-4 py-3 font-medium">Nama</th>
            <th className="px-4 py-3 font-medium">Harga</th>
            <th className="px-4 py-3 font-medium">Urutan</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Memuat...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Belum ada aksesori.</td></tr>
            ) : items.map((a) => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3">{a.image_url ? <img src={a.image_url} alt={a.name} className="h-10 w-16 rounded object-contain bg-gray-100" /> : <div className="h-10 w-16 rounded bg-gray-100" />}</td>
                <td className="px-4 py-3 font-medium text-gray-700">{a.name}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{formatRupiah(a.price)}</td>
                <td className="px-4 py-3 text-gray-500">{a.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => openEdit(a)} className="rounded px-2 py-1 text-xs text-gray-400 hover:text-emerald-500">Edit</button>
                  <button type="button" onClick={() => { setActive(a); setModal("delete"); }} className="rounded px-2 py-1 text-xs text-gray-400 hover:text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setModal("closed")}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">{modal === "add" ? "Tambah Aksesori" : `Edit: ${active?.name}`}</h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <Field label="Nama *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <NumField label="Harga (Rp)" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
              <ImageUpload value={form.image_url} onChange={(v) => setForm((f) => ({ ...f, image_url: v }))} />
              <NumField label="Urutan" value={form.sort_order} onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))} />
            </div>
            <ModalFooter saving={saving} disabled={!form.name.trim()} onCancel={() => setModal("closed")} onSave={handleSave} label={modal === "add" ? "Tambah" : "Simpan"} />
          </div>
        </div>
      )}
      {modal === "delete" && active && <DeleteModal name={active.name} saving={saving} onCancel={() => setModal("closed")} onDelete={handleDelete} />}
    </>
  );
}

// ─── Shared components ───

function Field({ label, value, onChange, placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  const cls = "rounded-lg border border-gray-200 px-3 py-2 text-sm";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-none`} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full" />
    </div>
  );
}

function ModalFooter({ saving, disabled, onCancel, onSave, label }: { saving: boolean; disabled: boolean; onCancel: () => void; onSave: () => void; label: string }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
      <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Batal</button>
      <button type="button" onClick={onSave} disabled={saving || disabled} className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40">
        {saving ? "Menyimpan..." : label}
      </button>
    </div>
  );
}

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch { alert("Gagal upload gambar"); }
    finally { setUploading(false); }
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gambar</label>
      {value && <img src={value} alt="preview" className="h-24 w-36 rounded-lg object-contain bg-gray-100" />}
      <div className="flex items-center gap-3">
        <label className={`cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 ${uploading ? "opacity-40 pointer-events-none" : ""}`}>
          {uploading ? "Mengupload..." : value ? "Ganti Gambar" : "Pilih Gambar"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && <button type="button" onClick={() => onChange("")} className="text-xs text-red-400 hover:text-red-600">Hapus</button>}
      </div>
    </div>
  );
}

function DeleteModal({ name, saving, onCancel, onDelete }: { name: string; saving: boolean; onCancel: () => void; onDelete: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-gray-800">Hapus Item</h2>
        <p className="mt-2 text-sm text-gray-500">Yakin mau hapus <strong>{name}</strong>?</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Batal</button>
          <button type="button" onClick={onDelete} disabled={saving} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-40">
            {saving ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───

const tabs: { key: Tab; label: string }[] = [
  { key: "shapes", label: "Shapes" },
  { key: "blades", label: "Blades" },
  { key: "handles", label: "Handles" },
  { key: "accessories", label: "Accessories" },
];

export default function ConfiguratorAdminPage() {
  const [tab, setTab] = useState<Tab>("shapes");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Knife Configurator</h1>
        <p className="text-sm text-gray-400">Kelola komponen konfigurator pisau — shape, blade, handle, dan aksesori.</p>
      </div>

      <div className="flex gap-1 rounded-lg bg-white p-1 shadow-sm w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-emerald-500 text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "shapes" && <ShapePanel />}
      {tab === "blades" && <BladePanel />}
      {tab === "handles" && <HandlePanel />}
      {tab === "accessories" && <AccessoryPanel />}
    </div>
  );
}
