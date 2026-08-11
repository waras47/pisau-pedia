"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { apiFetch } from "@/shared/api/client";
import { uploadImage } from "@/shared/api/upload.api";
import { HttpError } from "@/shared/api/http-error";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SiteContentRow {
  id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

interface HeroSlide {
  image: string;
  alt: string;
  alt_id: string;
  alt_en: string;
}

interface HeroText {
  eyebrow: string;
  eyebrow_id: string;
  eyebrow_en: string;
  title: string;
  title_id: string;
  title_en: string;
  subtitle: string;
  subtitle_id: string;
  subtitle_en: string;
  cta_primary: string;
  cta_primary_id: string;
  cta_primary_en: string;
  cta_secondary: string;
  cta_secondary_id: string;
  cta_secondary_en: string;
  footer: string;
  footer_id: string;
  footer_en: string;
}

interface CategoryBanner {
  title: string;
  title_id: string;
  title_en: string;
  description: string;
  description_id: string;
  description_en: string;
  cta: string;
  cta_id: string;
  cta_en: string;
  href: string;
  image: string;
}

interface BrowseCategory {
  title: string;
  title_id: string;
  title_en: string;
  href: string;
  image: string;
}

interface FeaturedBanner {
  badge: string;
  badge_id: string;
  badge_en: string;
  title: string;
  title_id: string;
  title_en: string;
  description: string;
  description_id: string;
  description_en: string;
  cta: string;
  cta_id: string;
  cta_en: string;
  image: string;
}

interface ExchangeRateOverride {
  mode: "auto" | "manual";
  usd_to_idr: number;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                           */
/* ------------------------------------------------------------------ */

const defaultHeroSlides: HeroSlide[] = [{ image: "", alt: "", alt_id: "", alt_en: "" }];
const defaultHeroText: HeroText = {
  eyebrow: "", eyebrow_id: "", eyebrow_en: "",
  title: "", title_id: "", title_en: "",
  subtitle: "", subtitle_id: "", subtitle_en: "",
  cta_primary: "", cta_primary_id: "", cta_primary_en: "",
  cta_secondary: "", cta_secondary_id: "", cta_secondary_en: "",
  footer: "", footer_id: "", footer_en: "",
};
const defaultCategoryBanners: CategoryBanner[] = [
  { title: "", title_id: "", title_en: "", description: "", description_id: "", description_en: "", cta: "", cta_id: "", cta_en: "", href: "", image: "" },
  { title: "", title_id: "", title_en: "", description: "", description_id: "", description_en: "", cta: "", cta_id: "", cta_en: "", href: "", image: "" },
];
const defaultBrowseCategories: BrowseCategory[] = [
  { title: "", title_id: "", title_en: "", href: "", image: "" },
  { title: "", title_id: "", title_en: "", href: "", image: "" },
  { title: "", title_id: "", title_en: "", href: "", image: "" },
];
const defaultFeaturedBanner: FeaturedBanner = {
  badge: "", badge_id: "", badge_en: "",
  title: "", title_id: "", title_en: "",
  description: "", description_id: "", description_en: "",
  cta: "", cta_id: "", cta_en: "",
  image: "",
};
const defaultExchangeRateOverride: ExchangeRateOverride = { mode: "auto", usd_to_idr: 0 };

/* ------------------------------------------------------------------ */
/*  Section config                                                     */
/* ------------------------------------------------------------------ */

const SECTION_KEYS = [
  "hero_slides",
  "hero_text",
  "category_banners",
  "browse_categories",
  "featured_banner",
  "exchange_rate_override",
] as const;

type SectionKey = (typeof SECTION_KEYS)[number];

const SECTION_LABELS: Record<SectionKey, string> = {
  hero_slides: "Hero Slides",
  hero_text: "Hero Text",
  category_banners: "Category Banners",
  browse_categories: "Browse Categories (Jelajahi Koleksi)",
  featured_banner: "Featured Banner",
  exchange_rate_override: "Kurs Mata Uang (USD/IDR)",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SiteContentsPage() {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [savedData, setSavedData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = useCallback((msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const rows = await apiFetch<SiteContentRow[]>("/admin/site-contents");
        const map: Record<string, unknown> = {};
        for (const r of rows) map[r.key] = r.value;
        setData({ ...map });
        setSavedData({ ...map });
      } catch (err) {
        showToast(err instanceof HttpError ? err.message : "Gagal memuat konten", "err");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  function toggleSection(key: string) {
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));
  }

  function updateSection(key: string, value: unknown) {
    setData((p) => ({ ...p, [key]: value }));
  }

  function isModified(key: string) {
    return JSON.stringify(data[key]) !== JSON.stringify(savedData[key]);
  }

  async function handleSave(key: string) {
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      await apiFetch("/admin/site-contents", {
        method: "PUT",
        body: JSON.stringify({ key, value: data[key] }),
      });
      setSavedData((p) => ({ ...p, [key]: JSON.parse(JSON.stringify(data[key])) }));
      showToast(`${SECTION_LABELS[key as SectionKey]} berhasil disimpan`, "ok");
    } catch (err) {
      showToast(err instanceof HttpError ? err.message : "Gagal menyimpan", "err");
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">Memuat konten...</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Konten Website</h1>
        <p className="text-sm text-gray-400">Kelola konten dinamis halaman utama (multi-bahasa ID/EN)</p>
      </div>

      {/* Sections */}
      {SECTION_KEYS.map((key) => {
        const open = openSections[key] ?? false;
        const modified = isModified(key);
        return (
          <div key={key} className="rounded-xl bg-white shadow-sm">
            <button
              type="button"
              onClick={() => toggleSection(key)}
              className="flex w-full items-center gap-3 px-6 py-4"
            >
              <ChevronIcon open={open} />
              <span className="flex-1 text-left text-sm font-semibold text-gray-700">
                {SECTION_LABELS[key]}
              </span>
              {modified && (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-600">
                  Belum disimpan
                </span>
              )}
              {!modified && savedData[key] !== undefined && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600">
                  Tersimpan
                </span>
              )}
            </button>
            {open && (
              <div className="border-t border-gray-100 px-6 py-5">
                <SectionForm
                  sectionKey={key}
                  value={data[key]}
                  onChange={(v) => updateSection(key, v)}
                />
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    disabled={saving[key] || !modified}
                    onClick={() => handleSave(key)}
                    className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-40"
                  >
                    {saving[key] ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <GlobalStyles />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "ok" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section form router                                                */
/* ------------------------------------------------------------------ */

function SectionForm({
  sectionKey,
  value,
  onChange,
}: {
  sectionKey: SectionKey;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (sectionKey) {
    case "hero_slides":
      return <HeroSlidesForm value={(value as HeroSlide[] | undefined) ?? defaultHeroSlides} onChange={onChange} />;
    case "hero_text":
      return <HeroTextForm value={(value as HeroText | undefined) ?? defaultHeroText} onChange={onChange} />;
    case "category_banners":
      return <CategoryBannersForm value={(value as CategoryBanner[] | undefined) ?? defaultCategoryBanners} onChange={onChange} />;
    case "browse_categories":
      return <BrowseCategoriesForm value={(value as BrowseCategory[] | undefined) ?? defaultBrowseCategories} onChange={onChange} />;
    case "featured_banner":
      return <FeaturedBannerForm value={(value as FeaturedBanner | undefined) ?? defaultFeaturedBanner} onChange={onChange} />;
    case "exchange_rate_override":
      return <ExchangeRateForm value={(value as ExchangeRateOverride | undefined) ?? defaultExchangeRateOverride} onChange={onChange} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Bilingual field pair                                                */
/* ------------------------------------------------------------------ */

function BilingualField({
  label,
  valueId,
  valueEn,
  onChangeId,
  onChangeEn,
  full,
  multiline,
}: {
  label: string;
  valueId: string;
  valueEn: string;
  onChangeId: (v: string) => void;
  onChangeEn: (v: string) => void;
  full?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-blue-500">🇮🇩 Indonesia</span>
          {multiline ? (
            <textarea rows={3} value={valueId} onChange={(e) => onChangeId(e.target.value)} className="sc-input resize-none" />
          ) : (
            <input type="text" value={valueId} onChange={(e) => onChangeId(e.target.value)} className="sc-input" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-red-500">🇬🇧 English</span>
          {multiline ? (
            <textarea rows={3} value={valueEn} onChange={(e) => onChangeEn(e.target.value)} className="sc-input resize-none" />
          ) : (
            <input type="text" value={valueEn} onChange={(e) => onChangeEn(e.target.value)} className="sc-input" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Slides                                                        */
/* ------------------------------------------------------------------ */

function HeroSlidesForm({ value, onChange }: { value: HeroSlide[]; onChange: (v: HeroSlide[]) => void }) {
  function update(idx: number, patch: Partial<HeroSlide>) {
    const next = value.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange(next);
  }
  function add() {
    onChange([...value, { image: "", alt: "", alt_id: "", alt_en: "" }]);
  }
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((slide, idx) => (
        <div key={idx} className="rounded-lg border border-gray-100 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Slide {idx + 1}</span>
            {value.length > 1 && (
              <button type="button" onClick={() => remove(idx)} className="text-xs text-red-500 hover:underline">Hapus</button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ImageUploadField
              label="Gambar"
              value={slide.image}
              onUploaded={(url) => update(idx, { image: url })}
            />
            <BilingualField
              label="Alt Text"
              valueId={slide.alt_id || slide.alt || ""}
              valueEn={slide.alt_en || ""}
              onChangeId={(v) => update(idx, { alt_id: v, alt: v })}
              onChangeEn={(v) => update(idx, { alt_en: v })}
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="self-start rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600">
        + Tambah Slide
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Text                                                          */
/* ------------------------------------------------------------------ */

function HeroTextForm({ value, onChange }: { value: HeroText; onChange: (v: HeroText) => void }) {
  function updateBilingual(field: string, lang: "id" | "en", val: string) {
    const patch: Record<string, string> = { [`${field}_${lang}`]: val };
    if (lang === "id") patch[field] = val;
    onChange({ ...value, ...patch });
  }

  const fields: { key: string; label: string }[] = [
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle" },
    { key: "cta_primary", label: "CTA Primary" },
    { key: "cta_secondary", label: "CTA Secondary" },
    { key: "footer", label: "Footer" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <BilingualField
          key={f.key}
          label={f.label}
          valueId={(value as Record<string, string>)[`${f.key}_id`] || (value as Record<string, string>)[f.key] || ""}
          valueEn={(value as Record<string, string>)[`${f.key}_en`] || ""}
          onChangeId={(v) => updateBilingual(f.key, "id", v)}
          onChangeEn={(v) => updateBilingual(f.key, "en", v)}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Banners                                                   */
/* ------------------------------------------------------------------ */

function CategoryBannersForm({ value, onChange }: { value: CategoryBanner[]; onChange: (v: CategoryBanner[]) => void }) {
  function update(idx: number, patch: Partial<CategoryBanner>) {
    const next = value.map((b, i) => (i === idx ? { ...b, ...patch } : b));
    onChange(next);
  }
  function updateBilingual(idx: number, field: string, lang: "id" | "en", val: string) {
    const patch: Record<string, string> = { [`${field}_${lang}`]: val };
    if (lang === "id") patch[field] = val;
    update(idx, patch as Partial<CategoryBanner>);
  }
  function add() {
    onChange([...value, { title: "", title_id: "", title_en: "", description: "", description_id: "", description_en: "", cta: "", cta_id: "", cta_en: "", href: "", image: "" }]);
  }
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((banner, idx) => (
        <div key={idx} className="rounded-lg border border-gray-100 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Banner {idx + 1}</span>
            {value.length > 1 && (
              <button type="button" onClick={() => remove(idx)} className="text-xs text-red-500 hover:underline">Hapus</button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <BilingualField
              label="Judul"
              valueId={banner.title_id || banner.title || ""}
              valueEn={banner.title_en || ""}
              onChangeId={(v) => updateBilingual(idx, "title", "id", v)}
              onChangeEn={(v) => updateBilingual(idx, "title", "en", v)}
            />
            <BilingualField
              label="Deskripsi"
              valueId={banner.description_id || banner.description || ""}
              valueEn={banner.description_en || ""}
              onChangeId={(v) => updateBilingual(idx, "description", "id", v)}
              onChangeEn={(v) => updateBilingual(idx, "description", "en", v)}
            />
            <BilingualField
              label="Teks CTA"
              valueId={banner.cta_id || banner.cta || ""}
              valueEn={banner.cta_en || ""}
              onChangeId={(v) => updateBilingual(idx, "cta", "id", v)}
              onChangeEn={(v) => updateBilingual(idx, "cta", "en", v)}
            />
            <Field label="Link (href)">
              <input type="text" value={banner.href} onChange={(e) => update(idx, { href: e.target.value })} className="sc-input" />
            </Field>
            <ImageUploadField label="Gambar" value={banner.image} onUploaded={(url) => update(idx, { image: url })} />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="self-start rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600">
        + Tambah Banner
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Browse Categories                                                  */
/* ------------------------------------------------------------------ */

function BrowseCategoriesForm({ value, onChange }: { value: BrowseCategory[]; onChange: (v: BrowseCategory[]) => void }) {
  function update(idx: number, patch: Partial<BrowseCategory>) {
    const next = value.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    onChange(next);
  }
  function updateBilingual(idx: number, field: string, lang: "id" | "en", val: string) {
    const patch: Record<string, string> = { [`${field}_${lang}`]: val };
    if (lang === "id") patch[field] = val;
    update(idx, patch as Partial<BrowseCategory>);
  }
  function add() {
    onChange([...value, { title: "", title_id: "", title_en: "", href: "", image: "" }]);
  }
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((cat, idx) => (
        <div key={idx} className="rounded-lg border border-gray-100 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Kategori {idx + 1}</span>
            {value.length > 1 && (
              <button type="button" onClick={() => remove(idx)} className="text-xs text-red-500 hover:underline">Hapus</button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <BilingualField
              label="Judul"
              valueId={cat.title_id || cat.title || ""}
              valueEn={cat.title_en || ""}
              onChangeId={(v) => updateBilingual(idx, "title", "id", v)}
              onChangeEn={(v) => updateBilingual(idx, "title", "en", v)}
            />
            <Field label="Link (href)">
              <input type="text" value={cat.href} onChange={(e) => update(idx, { href: e.target.value })} className="sc-input" />
            </Field>
            <ImageUploadField label="Gambar" value={cat.image} onUploaded={(url) => update(idx, { image: url })} />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="self-start rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600">
        + Tambah Kategori
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured Banner                                                    */
/* ------------------------------------------------------------------ */

function FeaturedBannerForm({ value, onChange }: { value: FeaturedBanner; onChange: (v: FeaturedBanner) => void }) {
  function updateBilingual(field: string, lang: "id" | "en", val: string) {
    const patch: Record<string, string> = { [`${field}_${lang}`]: val };
    if (lang === "id") patch[field] = val;
    onChange({ ...value, ...patch });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BilingualField
        label="Badge"
        valueId={value.badge_id || value.badge || ""}
        valueEn={value.badge_en || ""}
        onChangeId={(v) => updateBilingual("badge", "id", v)}
        onChangeEn={(v) => updateBilingual("badge", "en", v)}
      />
      <BilingualField
        label="Judul"
        valueId={value.title_id || value.title || ""}
        valueEn={value.title_en || ""}
        onChangeId={(v) => updateBilingual("title", "id", v)}
        onChangeEn={(v) => updateBilingual("title", "en", v)}
      />
      <BilingualField
        label="Deskripsi"
        valueId={value.description_id || value.description || ""}
        valueEn={value.description_en || ""}
        onChangeId={(v) => updateBilingual("description", "id", v)}
        onChangeEn={(v) => updateBilingual("description", "en", v)}
        full
        multiline
      />
      <BilingualField
        label="Teks CTA"
        valueId={value.cta_id || value.cta || ""}
        valueEn={value.cta_en || ""}
        onChangeId={(v) => updateBilingual("cta", "id", v)}
        onChangeEn={(v) => updateBilingual("cta", "en", v)}
      />
      <Field label="Gambar" full>
        <ImageUploadField label="Gambar" value={value.image} onUploaded={(url) => onChange({ ...value, image: url })} />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exchange Rate Override                                             */
/* ------------------------------------------------------------------ */

function ExchangeRateForm({ value, onChange }: { value: ExchangeRateOverride; onChange: (v: ExchangeRateOverride) => void }) {
  const rate = value.usd_to_idr || 0;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Secara default, kurs USD ke IDR diambil otomatis dari internet dan diperbarui berkala.
        Pilih &ldquo;Manual&rdquo; untuk menentukan sendiri berapa Rupiah per 1 Dolar — semua harga
        produk yang ditampilkan dalam USD akan dihitung ulang pakai angka ini.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className={`flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-4 ${value.mode === "auto" ? "border-emerald-400 bg-emerald-50/50" : "border-gray-200"}`}>
          <input
            type="radio"
            name="exchange-rate-mode"
            checked={value.mode === "auto"}
            onChange={() => onChange({ ...value, mode: "auto" })}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-semibold text-gray-700">Otomatis</span>
            <span className="block text-xs text-gray-500">Ikuti kurs pasar global (update tiap beberapa jam).</span>
          </span>
        </label>
        <label className={`flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-4 ${value.mode === "manual" ? "border-emerald-400 bg-emerald-50/50" : "border-gray-200"}`}>
          <input
            type="radio"
            name="exchange-rate-mode"
            checked={value.mode === "manual"}
            onChange={() => onChange({ ...value, mode: "manual" })}
            className="mt-1"
          />
          <span>
            <span className="block text-sm font-semibold text-gray-700">Manual</span>
            <span className="block text-xs text-gray-500">Tentukan sendiri kursnya.</span>
          </span>
        </label>
      </div>

      {value.mode === "manual" && (
        <Field label="1 USD = Rp">
          <input
            type="number"
            min={1}
            step={1}
            value={rate || ""}
            onChange={(e) => onChange({ ...value, usd_to_idr: Number(e.target.value) })}
            placeholder="misal 15800"
            className="sc-input max-w-xs"
          />
          {rate > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              Contoh: produk Rp 10.000 akan tampil sebagai{" "}
              <strong>${(10000 / rate).toFixed(2)}</strong> di mode USD.
            </p>
          )}
        </Field>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared components                                                  */
/* ------------------------------------------------------------------ */

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onUploaded,
}: {
  label: string;
  value: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch {
      alert("Gagal mengupload gambar");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-16 rounded-lg border border-gray-100 object-cover" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          {uploading ? "Mengupload..." : value ? "Ganti Gambar" : "Upload Gambar"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </Field>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .sc-input {
        width: 100%;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        color: #374151;
        outline: none;
        transition: border-color 0.15s;
      }
      .sc-input:focus {
        border-color: #10b981;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
      }
    `}</style>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
