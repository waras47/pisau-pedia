# Kissaki Shop — Ringkasan Langkah Develop

Project e-commerce pisau Jepang berbasis **Next.js 14 (App Router) + TypeScript + Tailwind**
dengan arsitektur **Feature-Sliced Design (FSD)**. Dokumen ini merangkum semua fitur yang
dibangun bertahap: collection page → product detail → cart → checkout (Xendit) → configurator.

> Referensi tampilan: https://sharpedgeshop.com

---

## 0. Arsitektur (FSD)

Aturan impor: layer atas hanya boleh mengimpor dari layer di bawahnya.

```
app/        ← halaman & route (URL)
widgets/    ← potongan halaman utuh (gabungan beberapa fitur/entity)
features/   ← aksi/interaksi user (cart, checkout, configurator, toolbar)
entities/   ← model bisnis + UI dasarnya (product, review, configurator)
shared/     ← util & UI primitif (Button, Badge, Container, dll.)
```

Setiap slice punya barrel `index.ts`; impor selalu lewat `@/entities/product`, bukan path internal.

---

## 1. Collection Page — `/collections/[handle]`

Daftar produk dengan filter kategori + sort.

| File | Peran |
|------|-------|
| `entities/product/model/product.data.ts` | data `japaneseKnives[]` |
| `entities/product/ui/ProductGrid.tsx` | grid kartu produk |
| `features/collection-toolbar/ui/CollectionToolbar.tsx` | filter + sort (`useState`/`useMemo`), client |
| `widgets/collection-listing/CollectionListing.tsx` | heading + toolbar |
| `app/collections/[handle]/page.tsx` | route + `generateStaticParams` + `generateMetadata` |

Inti: filter & sort dihitung di `useMemo`; hanya toolbar yang `"use client"`.

---

## 2. Product Detail — `/products/[slug]`

| File | Peran |
|------|-------|
| `entities/product/model/product.types.ts` | tambah field opsional: `description`, `highlights`, `specs`, `galleryLabels` |
| `entities/product/lib/get-product.ts` | `getProductBySlug`, `getRelatedProducts`, `allProducts` |
| `features/add-to-cart/ui/AddToCart.tsx` | quantity + tombol Add (client) |
| `widgets/product-detail/ProductDetail.tsx` | galeri + info + specs + reviews + related |
| `app/products/[slug]/page.tsx` | route, `notFound()` jika slug tak ada |

Inti: semua produk dicari lewat satu helper `getProductBySlug` → mudah diganti CMS/API.

---

## 3. Cart — Context + Drawer + `/cart`

State global keranjang dengan persistensi `localStorage`.

| File | Peran |
|------|-------|
| `features/cart/model/cart.types.ts` | tipe `CartItem`, `CartContextValue` |
| `features/cart/model/CartProvider.tsx` | context + state + localStorage + render `<CartDrawer/>` |
| `features/cart/ui/CartDrawer.tsx` | slide-over (overlay, Esc, lock scroll) |
| `features/cart/ui/CartButton.tsx` | tombol header + badge jumlah |
| `app/cart/page.tsx` | halaman cart penuh |
| `app/layout.tsx` | dibungkus `<CartProvider>` |
| `widgets/header/Header.tsx` | pakai `<CartButton/>` |

Inti: **satu sumber kebenaran** (`useCart()`) dipakai drawer, header, halaman cart, dan tombol Add.
Flag `hydrated` mencegah localStorage tertimpa array kosong saat render pertama.

---

## 4. Checkout — Xendit (`/checkout`)

Hosted invoice: form → Route Handler → buat invoice Xendit → redirect ke halaman bayar.

| File | Peran |
|------|-------|
| `.env.local` | `XENDIT_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL` (lihat `.env.example`) |
| `features/checkout/ui/CheckoutForm.tsx` | form kontak + alamat (client), POST ke API |
| `app/checkout/page.tsx` | form + ringkasan order |
| `app/api/checkout/route.ts` | server: hitung ulang harga dari katalog → POST `api.xendit.co/v2/invoices` |
| `app/checkout/success/page.tsx` | sukses + `clearCart()` |
| `app/checkout/failure/page.tsx` | gagal/cancel |

Inti keamanan:
- Secret hanya di server (tanpa `NEXT_PUBLIC_`).
- Harga **dihitung ulang di server** via `getProductBySlug` → browser hanya kirim `slug` + `quantity` (anti-tamper).
- Tanpa dependency baru — cukup `fetch` + Basic auth `base64(secret + ":")`.

> Catatan: Xendit akun Indonesia memproses **IDR** (integer, tanpa desimal). Konstanta `CURRENCY = "IDR"`
> di route; sesuaikan harga produk ke nominal IDR untuk produksi.

---

## 5. Knife Configurator — `/pages/configurator`

Produk "configurable": user merakit pisau (blade, length, steel, finish, handle), harga ter-update otomatis.

| File | Peran |
|------|-------|
| `entities/configurator/model/configurator.types.ts` | tipe `ConfiguratorGroup`, `ConfiguratorOption` |
| `entities/configurator/model/configurator.data.ts` | `BASE_PRICE` + grup opsi dengan `priceDelta` |
| `features/knife-configurator/ui/KnifeConfigurator.tsx` | pilihan + `useMemo(total)` + `addItem` (client) |
| `app/pages/configurator/page.tsx` | route |

Inti: **harga = `BASE_PRICE + Σ priceDelta` terpilih**, dihitung di `useMemo`. Produk custom dibuat
on-the-fly sebagai objek `Product` lalu masuk cart yang sama.

---

## Cara menjalankan

```bash
npm install
cp .env.example .env.local   # isi XENDIT_SECRET_KEY
npm run dev                  # http://localhost:3000
```

Cek kualitas:

```bash
npm run typecheck
npm run lint
```

## Rute penting

| URL | Halaman |
|-----|---------|
| `/` | Homepage |
| `/collections/japanese-knives` | Daftar produk + filter/sort |
| `/products/aoi-gyuto-210` | Detail produk (paling lengkap) |
| `/cart` | Keranjang |
| `/checkout` | Checkout → Xendit |
| `/pages/configurator` | Build a knife (configurable) |

---

## Saran lanjutan (produksi)

1. **Webhook Xendit** (`/api/webhooks/xendit`) verifikasi `x-callback-token` — jangan andalkan redirect.
2. **Database order** (Prisma/Postgres): simpan `PENDING` saat invoice dibuat, update `PAID` via webhook.
3. **Custom build di checkout**: slug `custom-*` tak ada di katalog, hitung ulang dari `configuratorGroups` di server.
4. **Gambar asli**: ganti `PlaceholderImage` dengan `next/image`.
5. **URL state** untuk filter/sort di collection page (`useSearchParams`).
