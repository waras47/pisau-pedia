"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { HttpError } from "@/shared/api/http-error";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

import {
  type AddressApiItem,
  type AddressInput,
  createMyAddress,
  deleteMyAddress,
  listMyAddresses,
  updateMyAddress,
} from "@/entities/address/api/address.api";

import { useAuth } from "@/features/auth/model/AuthProvider";

const inputClass =
  "h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent";

const emptyForm: AddressInput = {
  label: "",
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  province: "",
  postal_code: "",
  is_default: false,
};

export default function AccountAddressesPage() {
  const { status } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AddressApiItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/account/login?redirect=/account/addresses");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function load() {
    setLoading(true);
    try {
      const items = await listMyAddresses();
      setAddresses(items);
      setError(null);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Gagal memuat alamat.");
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(address: AddressApiItem) {
    setEditing(address);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function handleSaved() {
    closeForm();
    await load();
  }

  async function handleDelete(address: AddressApiItem) {
    if (!confirm(`Hapus alamat "${address.label || address.full_name}"?`)) return;
    setBusyId(address.id);
    try {
      await deleteMyAddress(address.id);
      await load();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus alamat.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSetDefault(address: AddressApiItem) {
    setBusyId(address.id);
    try {
      await updateMyAddress(address.id, {
        label: address.label,
        full_name: address.full_name,
        phone: address.phone,
        address_line: address.address_line,
        city: address.city,
        province: address.province,
        postal_code: address.postal_code,
        is_default: true,
      });
      await load();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menjadikan alamat utama.");
    } finally {
      setBusyId(null);
    }
  }

  if (status !== "authenticated") return null;

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tightest">Alamat Saya</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Kelola alamat pengiriman yang tersimpan di akun Anda.
            </p>
          </div>
          {!formOpen ? (
            <Button onClick={openAdd} size="md">
              + Tambah Alamat
            </Button>
          ) : null}
        </div>

        {formOpen ? (
          <AddressForm
            initial={editing}
            onCancel={closeForm}
            onSaved={handleSaved}
          />
        ) : null}

        {loading ? (
          <p className="text-muted-foreground">Memuat…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : addresses.length === 0 && !formOpen ? (
          <p className="text-muted-foreground">Belum ada alamat tersimpan.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((a) => (
              <div key={a.id} className="border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{a.label || "Alamat"}</p>
                      {a.is_default ? (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                          Utama
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.full_name}
                      {a.phone ? ` · ${a.phone}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {a.address_line}, {a.city}
                      {a.province ? `, ${a.province}` : ""} {a.postal_code}
                    </p>
                  </div>
                  <div className="flex flex-none flex-col items-end gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="font-medium text-accent hover:underline"
                    >
                      Ubah
                    </button>
                    {!a.is_default ? (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(a)}
                        disabled={busyId === a.id}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                      >
                        Jadikan Utama
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(a)}
                      disabled={busyId === a.id}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function AddressForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: AddressApiItem | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<AddressInput>(
    initial
      ? {
          label: initial.label ?? "",
          full_name: initial.full_name,
          phone: initial.phone ?? "",
          address_line: initial.address_line,
          city: initial.city,
          province: initial.province ?? "",
          postal_code: initial.postal_code,
          is_default: initial.is_default,
        }
      : emptyForm,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof AddressInput>(key: K, value: AddressInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (initial) {
        await updateMyAddress(initial.id, form);
      } else {
        await createMyAddress(form);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Gagal menyimpan alamat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-border p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {initial ? "Ubah Alamat" : "Alamat Baru"}
      </h2>
      <input
        value={form.label ?? ""}
        onChange={(e) => set("label", e.target.value)}
        placeholder="Label (contoh: Rumah, Kantor)"
        className={inputClass}
      />
      <input
        value={form.full_name}
        onChange={(e) => set("full_name", e.target.value)}
        required
        minLength={2}
        placeholder="Nama penerima"
        className={inputClass}
      />
      <input
        value={form.phone ?? ""}
        onChange={(e) => set("phone", e.target.value)}
        placeholder="Nomor telepon (opsional)"
        className={inputClass}
      />
      <textarea
        value={form.address_line}
        onChange={(e) => set("address_line", e.target.value)}
        required
        placeholder="Alamat lengkap (jalan, nomor, RT/RW, kelurahan)"
        rows={2}
        className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
          required
          placeholder="Kota"
          className={inputClass}
        />
        <input
          value={form.province ?? ""}
          onChange={(e) => set("province", e.target.value)}
          placeholder="Provinsi (opsional)"
          className={inputClass}
        />
      </div>
      <input
        value={form.postal_code}
        onChange={(e) => set("postal_code", e.target.value)}
        required
        placeholder="Kode pos"
        className={inputClass}
      />
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={form.is_default}
          onChange={(e) => set("is_default", e.target.checked)}
        />
        Jadikan alamat utama
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan…" : "Simpan Alamat"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
