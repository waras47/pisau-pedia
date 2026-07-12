"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
  type CouponApiItem,
  type CouponApiType,
} from "@/entities/coupon/api/coupon.api";
import { HttpError } from "@/shared/api/http-error";

// --- Types ---

interface Coupon {
  id: string;
  code: string;
  type: CouponApiType;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
}

type DisplayStatus = "active" | "expired" | "scheduled" | "disabled";

type ModalMode = "closed" | "add" | "edit" | "delete";

interface SuccessInfo {
  type: "created" | "updated" | "deleted" | "enabled" | "disabled";
  name: string;
}

const emptyCoupon: Coupon = {
  id: "",
  code: "",
  type: "percentage",
  value: 10,
  minOrder: 0,
  maxUses: 0,
  usedCount: 0,
  startDate: "",
  endDate: "",
  isActive: true,
  description: "",
};

function toCouponVM(c: CouponApiItem): Coupon {
  return {
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    minOrder: c.min_order,
    maxUses: c.max_uses ?? 0,
    usedCount: c.used_count,
    startDate: c.starts_at ?? "",
    endDate: c.ends_at ?? "",
    isActive: c.is_active,
    description: c.description ?? "",
  };
}

function displayStatus(c: Coupon): DisplayStatus {
  if (!c.isActive) return "disabled";
  const today = new Date().toISOString().slice(0, 10);
  if (c.startDate && c.startDate > today) return "scheduled";
  if (c.endDate && c.endDate < today) return "expired";
  return "active";
}

// --- Helpers ---

function statusStyle(s: DisplayStatus) {
  switch (s) {
    case "active": return "bg-emerald-50 text-emerald-600";
    case "expired": return "bg-red-50 text-red-500";
    case "scheduled": return "bg-blue-50 text-blue-500";
    case "disabled": return "bg-gray-100 text-gray-400";
  }
}

function typeLabel(t: Coupon["type"]) {
  switch (t) {
    case "percentage": return "Percentage";
    case "fixed": return "Fixed Amount";
    case "free_shipping": return "Free Shipping";
  }
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function valueLabel(c: Coupon) {
  switch (c.type) {
    case "percentage": return `${c.value}%`;
    case "fixed": return formatRupiah(c.value);
    case "free_shipping": return "Free";
  }
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// --- Page ---

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalMode>("closed");
  const [editCoupon, setEditCoupon] = useState<Coupon>(emptyCoupon);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);

  async function loadCoupons() {
    setLoading(true);
    try {
      const items = await listCoupons();
      setCoupons(items.map(toCouponVM));
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat kupon");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  const showSuccess = useCallback((type: SuccessInfo["type"], name: string) => {
    setSuccessInfo({ type, name });
    setTimeout(() => setSuccessInfo(null), 2500);
  }, []);

  const filtered = useMemo(() => {
    let result = coupons;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
      );
    }
    if (filterStatus) {
      result = result.filter((c) => displayStatus(c) === filterStatus);
    }
    return result;
  }, [coupons, search, filterStatus]);

  const stats = useMemo(() => {
    const active = coupons.filter((c) => displayStatus(c) === "active").length;
    const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    const scheduled = coupons.filter((c) => displayStatus(c) === "scheduled").length;
    return { total: coupons.length, active, totalUsed, scheduled };
  }, [coupons]);

  const handleAdd = () => {
    setEditCoupon({ ...emptyCoupon, startDate: new Date().toISOString().slice(0, 10) });
    setModal("add");
  };

  const handleEdit = (c: Coupon) => {
    setEditCoupon({ ...c });
    setModal("edit");
  };

  const handleDeleteConfirm = (c: Coupon) => {
    setEditCoupon(c);
    setModal("delete");
  };

  async function handleSave() {
    if (!editCoupon.code.trim()) return;
    setSaving(true);
    try {
      const code = editCoupon.code.toUpperCase().replace(/\s+/g, "");
      const payload = {
        code,
        type: editCoupon.type,
        value: editCoupon.value,
        min_order: editCoupon.minOrder,
        max_uses: editCoupon.maxUses > 0 ? editCoupon.maxUses : undefined,
        starts_at: editCoupon.startDate || undefined,
        ends_at: editCoupon.endDate || undefined,
        is_active: editCoupon.isActive,
        description: editCoupon.description || undefined,
      };
      if (modal === "add") {
        await createCoupon(payload);
        showSuccess("created", code);
      } else {
        await updateCoupon(editCoupon.id, payload);
        showSuccess("updated", code);
      }
      await loadCoupons();
      setModal("closed");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menyimpan kupon");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteCoupon(editCoupon.id);
      showSuccess("deleted", editCoupon.code);
      await loadCoupons();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus kupon");
    } finally {
      setSaving(false);
      setModal("closed");
    }
  }

  async function toggleStatus(coupon: Coupon) {
    setSaving(true);
    try {
      await updateCoupon(coupon.id, {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        min_order: coupon.minOrder,
        max_uses: coupon.maxUses > 0 ? coupon.maxUses : undefined,
        starts_at: coupon.startDate || undefined,
        ends_at: coupon.endDate || undefined,
        is_active: !coupon.isActive,
        description: coupon.description || undefined,
      });
      showSuccess(coupon.isActive ? "disabled" : "enabled", coupon.code);
      await loadCoupons();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengubah status kupon");
    } finally {
      setSaving(false);
    }
  }

  const updateField = <K extends keyof Coupon>(key: K, value: Coupon[K]) => {
    setEditCoupon((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Success Modal */}
      {successInfo && (
        <CouponSuccessModal info={successInfo} onClose={() => setSuccessInfo(null)} />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
          <p className="text-sm text-gray-400">Kelola kode diskon & promosi</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600"
        >
          <PlusIcon /> Buat Kupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Kupon", value: stats.total, bg: "bg-gray-50", text: "text-gray-600" },
          { label: "Aktif", value: stats.active, bg: "bg-emerald-50", text: "text-emerald-600" },
          { label: "Terjadwal", value: stats.scheduled, bg: "bg-blue-50", text: "text-blue-600" },
          { label: "Total Terpakai", value: stats.totalUsed, bg: "bg-amber-50", text: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${s.bg} ${s.text}`}>
              {s.value}
            </div>
            <span className="text-sm text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
          <SearchIcon />
          <input
            type="text"
            placeholder="Cari kode atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="scheduled">Terjadwal</option>
          <option value="expired">Kedaluwarsa</option>
          <option value="disabled">Nonaktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">Kode</th>
                <th className="px-4 py-4 font-medium">Tipe</th>
                <th className="px-4 py-4 font-medium">Diskon</th>
                <th className="px-4 py-4 font-medium">Min. Order</th>
                <th className="px-4 py-4 font-medium">Pemakaian</th>
                <th className="px-4 py-4 font-medium">Periode</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Memuat...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Belum ada kupon.</td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const status = displayStatus(c);
                  return (
                    <tr key={c.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-bold text-gray-700">{c.code}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{typeLabel(c.type)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-700">{valueLabel(c)}</td>
                      <td className="px-4 py-3 text-gray-500">{c.minOrder > 0 ? formatRupiah(c.minOrder) : "—"}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {c.usedCount}{c.maxUses > 0 ? ` / ${c.maxUses}` : " / ∞"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatDate(c.startDate)} — {formatDate(c.endDate)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyle(status)}`}>{status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {(status === "active" || status === "disabled") && (
                            <button
                              type="button"
                              onClick={() => toggleStatus(c)}
                              disabled={saving}
                              className={`rounded p-1.5 text-gray-400 hover:bg-gray-100 disabled:opacity-40 ${status === "active" ? "hover:text-amber-500" : "hover:text-emerald-500"}`}
                              title={status === "active" ? "Nonaktifkan" : "Aktifkan"}
                            >
                              {status === "active" ? <PauseIcon /> : <PlayIcon />}
                            </button>
                          )}
                          <button type="button" onClick={() => handleEdit(c)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-500" title="Edit">
                            <EditIcon />
                          </button>
                          <button type="button" onClick={() => handleDeleteConfirm(c)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500" title="Hapus">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                {modal === "add" ? "Buat Kupon" : `Edit: ${editCoupon.code}`}
              </h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Kode Kupon *">
                    <input type="text" value={editCoupon.code} onChange={(e) => updateField("code", e.target.value.toUpperCase())} className="admin-input font-mono" placeholder="misal SUMMER20" />
                  </Field>
                  <Field label="Aktif?">
                    <select value={editCoupon.isActive ? "1" : "0"} onChange={(e) => updateField("isActive", e.target.value === "1")} className="admin-input">
                      <option value="1">Aktif</option>
                      <option value="0">Nonaktif</option>
                    </select>
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Tipe Diskon">
                    <select value={editCoupon.type} onChange={(e) => updateField("type", e.target.value as Coupon["type"])} className="admin-input">
                      <option value="percentage">Persentase (%)</option>
                      <option value="fixed">Nominal Tetap (Rp)</option>
                      <option value="free_shipping">Gratis Ongkir</option>
                    </select>
                  </Field>
                  {editCoupon.type !== "free_shipping" && (
                    <Field label={editCoupon.type === "percentage" ? "Nilai (%)" : "Nilai (Rp)"}>
                      <input type="number" min="0" value={editCoupon.value} onChange={(e) => updateField("value", Number(e.target.value))} className="admin-input" />
                    </Field>
                  )}
                  <Field label="Min. Order (Rp)">
                    <input type="number" min="0" value={editCoupon.minOrder} onChange={(e) => updateField("minOrder", Number(e.target.value))} className="admin-input" placeholder="0 = tanpa minimum" />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Maks. Pemakaian">
                    <input type="number" min="0" value={editCoupon.maxUses} onChange={(e) => updateField("maxUses", Number(e.target.value))} className="admin-input" placeholder="0 = tanpa batas" />
                  </Field>
                  <Field label="Tanggal Mulai">
                    <input type="date" value={editCoupon.startDate} onChange={(e) => updateField("startDate", e.target.value)} className="admin-input" />
                  </Field>
                  <Field label="Tanggal Berakhir">
                    <input type="date" value={editCoupon.endDate} onChange={(e) => updateField("endDate", e.target.value)} className="admin-input" />
                  </Field>
                </div>

                <Field label="Deskripsi">
                  <textarea rows={2} value={editCoupon.description} onChange={(e) => updateField("description", e.target.value)} className="admin-input resize-none" placeholder="Catatan internal soal kupon ini..." />
                </Field>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Batal</button>
              <button type="button" onClick={handleSave} disabled={saving || !editCoupon.code.trim()} className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40">
                {saving ? "Menyimpan..." : modal === "add" ? "Buat Kupon" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Modal */}
      {modal === "delete" && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <TrashIcon className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Hapus Kupon</h2>
            <p className="mt-2 text-sm text-gray-500">
              Hapus kupon <strong className="font-mono">{editCoupon.code}</strong>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Batal</button>
              <button type="button" onClick={handleDelete} disabled={saving} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-40">
                {saving ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          transition: border-color 0.15s;
        }
        .admin-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }
        .admin-input::placeholder { color: #9ca3af; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}

// --- Sub-components ---

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-fade-in">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function CouponSuccessModal({ info, onClose }: { info: SuccessInfo; onClose: () => void }) {
  const configs: Record<SuccessInfo["type"], { title: string; bg: string; color: string; btnBg: string; icon: "check" | "trash" | "toggle" }> = {
    created: { title: "Kupon Dibuat!", bg: "bg-emerald-100", color: "text-emerald-600", btnBg: "bg-emerald-500 hover:bg-emerald-600", icon: "check" },
    updated: { title: "Kupon Diperbarui!", bg: "bg-blue-100", color: "text-blue-600", btnBg: "bg-blue-500 hover:bg-blue-600", icon: "check" },
    deleted: { title: "Kupon Dihapus!", bg: "bg-red-100", color: "text-red-500", btnBg: "bg-red-500 hover:bg-red-600", icon: "trash" },
    enabled: { title: "Kupon Diaktifkan!", bg: "bg-emerald-100", color: "text-emerald-600", btnBg: "bg-emerald-500 hover:bg-emerald-600", icon: "toggle" },
    disabled: { title: "Kupon Dinonaktifkan!", bg: "bg-amber-100", color: "text-amber-600", btnBg: "bg-amber-500 hover:bg-amber-600", icon: "toggle" },
  };
  const c = configs[info.type];
  const messages: Record<SuccessInfo["type"], string> = {
    created: `Kupon "${info.name}" berhasil dibuat dan siap dipakai.`,
    updated: `Kupon "${info.name}" berhasil diperbarui.`,
    deleted: `Kupon "${info.name}" telah dihapus.`,
    enabled: `Kupon "${info.name}" sekarang aktif dan bisa dipakai customer.`,
    disabled: `Kupon "${info.name}" dinonaktifkan dan tidak bisa dipakai.`,
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-fade-in w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${c.bg}`}>
          {c.icon === "check" && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={c.color}><path d="M20 6 9 17l-5-5" /></svg>}
          {c.icon === "trash" && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c.color}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>}
          {c.icon === "toggle" && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c.color}><rect width="20" height="12" x="2" y="6" rx="6" /><circle cx={info.type === "enabled" ? "16" : "8"} cy="12" r="2" /></svg>}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{c.title}</h3>
        <p className="mt-1.5 text-sm text-gray-500">{messages[info.type]}</p>
        <button type="button" onClick={onClose} className={`mt-5 rounded-lg px-6 py-2 text-sm font-medium text-white ${c.btnBg}`}>OK</button>
      </div>
    </div>
  );
}

// --- Icons ---

function PlusIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
}
function SearchIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}
function EditIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></svg>;
}
function TrashIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>;
}
function PauseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="14" y="4" width="4" height="16" rx="1" /><rect x="6" y="4" width="4" height="16" rx="1" /></svg>;
}
function PlayIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>;
}
