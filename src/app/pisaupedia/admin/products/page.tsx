"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { HttpError } from "@/shared/api/http-error";
import { uploadImage } from "@/shared/api/upload.api";
import { ImageUploadField as SharedImageUploadField } from "@/shared/ui/ImageUploadField";

import { type CategoryApiItem,listCategories } from "@/entities/category/api/category.api";
import { type Product, type ProductAngleImages, type ProductSpec } from "@/entities/product";
import {
  createProduct,
  deleteProduct,
  getInventoryReport,
  getProductBySlug,
  type InventoryReportData,
  listProducts,
  type ProductApiItem,
  type ProductImageAngle,
  type ProductImageInput,
  updateProduct,
} from "@/entities/product/api/product.api";

// --- Types ---

type ModalMode = "closed" | "add" | "edit" | "delete" | "view" | "success";

interface SuccessInfo {
  type: "added" | "updated" | "deleted";
  name: string;
}

const emptyProduct: Product = {
  id: "",
  name: "",
  slug: "",
  sku: "",
  category: "",
  price: 0,
  currency: "IDR",
  rating: 0,
  reviewCount: 0,
  maker: "",
  description: "",
  careInstructions: "",
  badge: undefined,
  compareAtPrice: undefined,
  stock: 0,
  weight: 500,
  angleImages: {},
};

const angleOptions: { key: keyof ProductAngleImages; label: string }[] = [
  { key: "front", label: "Tampak Depan" },
  { key: "back", label: "Tampak Belakang" },
  { key: "side", label: "Tampak Samping" },
  { key: "top", label: "Tampak Atas" },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

const badgeOptions: { value: Product["badge"] | ""; label: string }[] = [
  { value: "", label: "In Stock" },
  { value: "new", label: "New" },
  { value: "sold-out", label: "Out of Stock" },
];

const collectionOptions = [
  "Japanese Knives",
  "Accessories",
  "Engravings",
] as const;

// --- Helpers ---

function generateId() {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getStatusStyle(badge: Product["badge"]) {
  switch (badge) {
    case "sold-out":
      return "bg-red-50 text-red-500";
    case "sale":
      return "bg-amber-50 text-amber-600";
    case "new":
      return "bg-blue-50 text-blue-500";
    default:
      return "bg-emerald-50 text-emerald-500";
  }
}

function getStatusLabel(badge: Product["badge"]) {
  switch (badge) {
    case "sold-out":
      return "Out of Stock";
    case "sale":
      return "On Sale";
    case "new":
      return "New";
    default:
      return "In Stock";
  }
}

// --- Main Component ---

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [modal, setModal] = useState<ModalMode>("closed");
  const [editProduct, setEditProduct] = useState<Product>(emptyProduct);
  // Seeded once from ?q= (e.g. arriving from the admin global search).
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "price" | "rating" | "category">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryApiItem[]>([]);
  const [inventory, setInventory] = useState<InventoryReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const [items, cats, inv] = await Promise.all([listProducts(), listCategories(), getInventoryReport()]);
      setProducts(items.map(toProductVM));
      setCategories(cats);
      setInventory(inv);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function toProductVM(p: ProductApiItem): Product {
    return {
      id: p.id, name: p.name, slug: p.slug, sku: p.sku, category: p.category ?? "",
      price: p.price, compareAtPrice: p.compare_at_price, currency: "IDR",
      rating: p.rating, reviewCount: p.review_count, maker: p.maker,
      badge: p.badge as Product["badge"], stock: p.stock, weight: p.weight, image: p.image,
    };
  }

  const PER_PAGE = 10;

  // Fields the backend also requires (Name, Price) plus Category, which
  // is only a frontend-enforced business rule — surfaced next to the Save
  // button instead of just silently disabling it with no explanation.
  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!editProduct.name.trim()) missing.push("Nama Produk");
    if (!editProduct.category.trim()) missing.push("Category");
    if (!editProduct.price || editProduct.price <= 0) missing.push("Harga");
    return missing;
  }, [editProduct.name, editProduct.category, editProduct.price]);

  // Derived
  const allCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.sku ?? "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.maker ?? "").toLowerCase().includes(q),
      );
    }
    if (filterCategory) {
      result = result.filter((p) => p.category === filterCategory);
    }
    if (filterStatus) {
      switch (filterStatus) {
        case "in-stock":
          result = result.filter((p) => (p.stock ?? 0) > 2);
          break;
        case "low-stock":
          result = result.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 2);
          break;
        case "out-of-stock":
          result = result.filter((p) => (p.stock ?? 0) === 0);
          break;
        case "new":
          result = result.filter((p) => p.badge === "new");
          break;
        case "sale":
          result = result.filter((p) => p.badge === "sale");
          break;
      }
    }
    const sorted = [...result];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "price":
          cmp = a.price - b.price;
          break;
        case "rating":
          cmp = a.rating - b.rating;
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [products, search, filterCategory, filterStatus, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const showSuccess = useCallback((type: SuccessInfo["type"], name: string) => {
    setSuccessInfo({ type, name });
    setTimeout(() => setSuccessInfo(null), 2500);
  }, []);

  // CRUD handlers
  const handleAdd = () => {
    setEditProduct({ ...emptyProduct, id: generateId() });
    setModal("add");
  };

  async function handleEdit(product: Product) {
    const detail = await getProductBySlug(product.slug);
    setEditProduct({
      ...product,
      description: detail.description,
      descriptionEn: detail.description_en,
      careInstructions: detail.care_instructions,
      specs: detail.specs,
      highlights: detail.highlights,
      image: detail.images[0],
      angleImages: { ...detail.angle_images },
    });
    setModal("edit");
  }

  const handleView = (product: Product) => {
    setEditProduct(product);
    setModal("view");
  };

  const handleDeleteConfirm = (product: Product) => {
    setEditProduct(product);
    setModal("delete");
  };

  async function handleSave() {
    if (missingFields.length > 0) return;
    setSaving(true);
    try {
      const categoryId = categories.find((c) => c.name === editProduct.category)?.id;
      const images: ProductImageInput[] = [];
      if (editProduct.image) images.push({ url: editProduct.image });
      for (const { key } of angleOptions) {
        const url = editProduct.angleImages?.[key];
        if (url) images.push({ url, angle: key as ProductImageAngle });
      }
      const payload = {
        category_id: categoryId,
        name: editProduct.name,
        sku: editProduct.sku || undefined,
        price: editProduct.price,
        compare_at_price: editProduct.compareAtPrice,
        maker: editProduct.maker || undefined,
        badge: editProduct.badge,
        stock: editProduct.stock,
        weight: editProduct.weight,
        description: editProduct.description,
        description_en: editProduct.descriptionEn || undefined,
        care_instructions: editProduct.careInstructions || undefined,
        specs: editProduct.specs,
        highlights: editProduct.highlights,
        images: images,
      };
      if (modal === "add") {
        await createProduct(payload);
        showSuccess("added", editProduct.name);
      } else {
        await updateProduct(editProduct.id, payload);
        showSuccess("updated", editProduct.name);
      }
      await loadProducts();
      setModal("closed");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteProduct(editProduct.id);
      showSuccess("deleted", editProduct.name);
      await loadProducts();
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus produk");
    } finally {
      setSaving(false);
      setModal("closed");
    }
  }

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const updateField = <K extends keyof Product>(key: K, value: Product[K]) => {
    setEditProduct((prev) => ({ ...prev, [key]: value }));
  };

  const SortArrow = ({ col }: { col: typeof sortKey }) =>
    sortKey === col ? (
      <span className="ml-1 text-emerald-500">{sortDir === "asc" ? "↑" : "↓"}</span>
    ) : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Success Modal */}
      {successInfo && (
        <SuccessModal info={successInfo} onClose={() => setSuccessInfo(null)} />
      )}

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-400">
            {products.length} total · {filtered.length} shown
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600"
        >
          <PlusIcon /> Tambah Produk
        </button>
      </div>

      {/* Stock stat cards */}
      {inventory && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {[
            { label: "Total Produk", value: inventory.total_products, icon: "🔪", gradient: "from-slate-400 to-slate-600" },
            { label: "Stok Tersedia", value: inventory.total_products - inventory.out_of_stock_count, icon: "✅", gradient: "from-emerald-400 to-emerald-600" },
            { label: "Stok Menipis", value: inventory.low_stock_count, icon: "⚠️", gradient: "from-amber-400 to-orange-500" },
            { label: "Stok Habis", value: inventory.out_of_stock_count, icon: "❌", gradient: "from-red-400 to-red-600" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-3 rounded-xl bg-gradient-to-br p-3 shadow-sm sm:p-4 ${s.gradient}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 text-lg">
                {s.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-white/80">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filters bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
        >
          <option value="">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
        >
          <option value="">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock (≤2)</option>
          <option value="out-of-stock">Out of Stock</option>
          <option value="new">New</option>
          <option value="sale">On Sale</option>
        </select>
        {(search || filterCategory || filterStatus) && (
          <button
            type="button"
            onClick={() => { setSearch(""); setFilterCategory(""); setFilterStatus(""); setCurrentPage(1); }}
            className="text-xs font-medium text-emerald-500 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Product table */}
      <div className="rounded-xl bg-white shadow-sm">
        {/* Mobile: cards with actions visible up front — the desktop
            table's Actions column was scrolling off-screen with no visual
            hint it existed. */}
        <div className="divide-y divide-gray-50 md:hidden">
          {paged.length === 0 ? (
            <p className="px-4 py-12 text-center text-gray-400">No products found matching your criteria.</p>
          ) : (
            paged.map((p) => (
              <div key={p.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                  {p.image ? (
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                      IMG
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-700">{p.name}</p>
                    <p className="truncate text-[11px] text-gray-400">{p.slug}</p>
                    {p.sku && <p className="truncate text-[11px] font-mono text-gray-400">SKU: {p.sku}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(p.badge)}`}>
                    {getStatusLabel(p.badge)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{p.category}</span>
                  <div className="text-right">
                    <p className="font-medium text-gray-700">{formatRupiah(p.price)}</p>
                    {p.compareAtPrice ? (
                      <p className="text-xs text-gray-400 line-through">{formatRupiah(p.compareAtPrice)}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                  <span className="text-xs text-gray-400">
                    {p.reviewCount > 0 ? (
                      <span className="text-amber-500">★ {p.rating} <span className="text-gray-400">({p.reviewCount})</span></span>
                    ) : (
                      "Belum ada rating"
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => handleView(p)} className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-500" title="View">
                      <EyeIcon />
                    </button>
                    <button type="button" onClick={() => handleEdit(p)} className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-emerald-500" title="Edit">
                      <EditIcon />
                    </button>
                    <button type="button" onClick={() => handleDeleteConfirm(p)} className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500" title="Delete">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop: full table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="px-4 py-4 font-medium">
                  <input type="checkbox" className="h-4 w-4 accent-emerald-500" disabled />
                </th>
                <th className="cursor-pointer px-4 py-4 font-medium hover:text-gray-600" onClick={() => handleSort("name")}>
                  Product <SortArrow col="name" />
                </th>
                <th className="cursor-pointer px-4 py-4 font-medium hover:text-gray-600" onClick={() => handleSort("category")}>
                  Category <SortArrow col="category" />
                </th>
                <th className="px-4 py-4 font-medium">Maker</th>
                <th className="cursor-pointer px-4 py-4 font-medium hover:text-gray-600" onClick={() => handleSort("price")}>
                  Price <SortArrow col="price" />
                </th>
                <th className="px-4 py-4 font-medium">Compare</th>
                <th className="cursor-pointer px-4 py-4 font-medium hover:text-gray-600" onClick={() => handleSort("rating")}>
                  Rating <SortArrow col="rating" />
                </th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                paged.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="h-4 w-4 accent-emerald-500" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-700">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.slug}</p>
                          {p.sku && <p className="text-[11px] font-mono text-gray-400">SKU: {p.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.maker || "—"}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{formatRupiah(p.price)}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {p.compareAtPrice ? <span className="line-through">{formatRupiah(p.compareAtPrice)}</span> : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {p.reviewCount > 0 ? (
                        <span className="text-amber-500">★ {p.rating} <span className="text-gray-400">({p.reviewCount})</span></span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(p.badge)}`}>
                        {getStatusLabel(p.badge)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => handleView(p)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-500" title="View">
                          <EyeIcon />
                        </button>
                        <button type="button" onClick={() => handleEdit(p)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-emerald-500" title="Edit">
                          <EditIcon />
                        </button>
                        <button type="button" onClick={() => handleDeleteConfirm(p)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500" title="Delete">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400">
              Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="rounded px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`rounded px-2.5 py-1.5 text-xs font-medium ${
                    pg === currentPage
                      ? "bg-emerald-500 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="rounded px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                {modal === "add" ? "Add New Product" : `Edit: ${editProduct.name}`}
              </h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-5">
                {/* Row 1 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Product Name *">
                    <input
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="admin-input"
                      placeholder="e.g. Aoi Gyuto 210mm"
                    />
                  </Field>
                  <Field label="Slug">
                    <input
                      type="text"
                      value={editProduct.slug || generateSlug(editProduct.name)}
                      onChange={(e) => updateField("slug", e.target.value)}
                      className="admin-input"
                      placeholder="auto-generated"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="SKU">
                    <input
                      type="text"
                      value={editProduct.sku ?? ""}
                      onChange={(e) => updateField("sku", e.target.value.toUpperCase())}
                      className="admin-input font-mono"
                      placeholder={modal === "add" ? "kosongkan untuk generate otomatis" : "—"}
                    />
                  </Field>
                </div>

                {/* Row 2 */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Category *">
                    <select
                      value={editProduct.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="admin-input"
                    >
                      <option value="">Pilih kategori</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Maker / Brand">
                    <input
                      type="text"
                      value={editProduct.maker ?? ""}
                      onChange={(e) => updateField("maker", e.target.value)}
                      className="admin-input"
                      placeholder="e.g. Tanaka Forge"
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={editProduct.badge ?? ""}
                      onChange={(e) => updateField("badge", (e.target.value || undefined) as Product["badge"])}
                      className="admin-input"
                    >
                      {badgeOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Image */}
                <SharedImageUploadField
                  label="Gambar Produk"
                  image={editProduct.image}
                  onChange={(url) => updateField("image", url)}
                />

                {/* Foto per-sudut (Depan/Belakang/Samping/Atas) */}
                <Field label="Foto Produk per Sudut">
                  <p className="mb-2 -mt-1 text-xs text-gray-400">
                    Dipakai di halaman detail produk customer sebagai galeri 4 sudut.
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {angleOptions.map(({ key, label }) => (
                      <AngleImageUploadField
                        key={key}
                        label={label}
                        image={editProduct.angleImages?.[key]}
                        onChange={(url) =>
                          updateField("angleImages", { ...editProduct.angleImages, [key]: url })
                        }
                      />
                    ))}
                  </div>
                </Field>

                {/* Row 3 - Pricing & Stock */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Harga (Rp) *">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editProduct.price}
                      onChange={(e) => updateField("price", Number(e.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Harga Coret (Rp)">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editProduct.compareAtPrice ?? ""}
                      onChange={(e) => updateField("compareAtPrice", e.target.value ? Number(e.target.value) : undefined)}
                      className="admin-input"
                      placeholder="Harga sebelum diskon"
                    />
                  </Field>
                  <Field label="Stok">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editProduct.stock ?? 0}
                      onChange={(e) => updateField("stock", Number(e.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Berat (gram)">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editProduct.weight ?? 500}
                      onChange={(e) => updateField("weight", Number(e.target.value))}
                      className="admin-input"
                      placeholder="Berat untuk hitung ongkir"
                    />
                  </Field>
                </div>

                {/* Description (bilingual) */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-medium text-blue-500">🇮🇩 Indonesia</span>
                      <textarea
                        rows={3}
                        value={editProduct.description ?? ""}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="admin-input resize-none"
                        placeholder="Deskripsi produk (Indonesia)..."
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-medium text-red-500">🇬🇧 English</span>
                      <textarea
                        rows={3}
                        value={editProduct.descriptionEn ?? ""}
                        onChange={(e) => updateField("descriptionEn", e.target.value)}
                        className="admin-input resize-none"
                        placeholder="Product description (English)..."
                      />
                    </div>
                  </div>
                </div>

                {/* Knife Care */}
                <Field label="Knife Care (perawatan pisau)">
                  <textarea
                    rows={3}
                    value={editProduct.careInstructions ?? ""}
                    onChange={(e) => updateField("careInstructions", e.target.value)}
                    className="admin-input resize-none"
                    placeholder="Kosongkan untuk pakai panduan perawatan umum bawaan situs..."
                  />
                </Field>

                {/* Specs */}
                <SpecsEditor
                  specs={editProduct.specs ?? []}
                  onChange={(specs) => updateField("specs", specs)}
                />

                {/* Highlights */}
                <HighlightsEditor
                  highlights={editProduct.highlights ?? []}
                  onChange={(h) => updateField("highlights", h)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              {missingFields.length > 0 && (
                <p className="mr-auto text-xs text-red-500">
                  Lengkapi dulu: {missingFields.join(", ")}
                </p>
              )}
              <button
                type="button"
                onClick={() => setModal("closed")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={missingFields.length > 0 || saving}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
              >
                {saving ? "Menyimpan..." : modal === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* View Modal */}
      {modal === "view" && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Product Details</h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="mb-4 flex items-center gap-4">
                {editProduct.image ? (
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editProduct.image}
                      alt={editProduct.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">IMG</div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{editProduct.name}</h3>
                  <p className="text-sm text-gray-400">{editProduct.slug}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <DetailRow label="Category" value={editProduct.category} />
                <DetailRow label="Maker" value={editProduct.maker || "—"} />
                <DetailRow label="Harga" value={formatRupiah(editProduct.price)} />
                <DetailRow label="Harga Coret" value={editProduct.compareAtPrice ? formatRupiah(editProduct.compareAtPrice) : "—"} />
                <DetailRow label="Stok" value={String(editProduct.stock ?? 0)} />
                <DetailRow label="Status" value={getStatusLabel(editProduct.badge)} />
                <DetailRow label="Rating" value={editProduct.reviewCount > 0 ? `★ ${editProduct.rating} (${editProduct.reviewCount})` : "No reviews"} />
              </div>
              {editProduct.description && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold uppercase text-gray-400">Description</p>
                  <p className="mt-1 text-sm text-gray-600">{editProduct.description}</p>
                </div>
              )}
              {editProduct.specs && editProduct.specs.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Specifications</p>
                  {editProduct.specs.map((s, i) => (
                    <div key={i} className="flex justify-between border-b border-gray-50 py-1.5 text-sm">
                      <span className="text-gray-500">{s.label}</span>
                      <span className="font-medium text-gray-700">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => { setModal("closed"); handleEdit(editProduct); }}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Edit Product
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {modal === "delete" && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <TrashIcon className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Delete Product</h2>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete <strong>{editProduct.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal("closed")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete
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
        .admin-input::placeholder {
          color: #9ca3af;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

// --- Sub-components ---

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-fade-in">
        {children}
      </div>
    </div>
  );
}

function SuccessModal({ info, onClose }: { info: SuccessInfo; onClose: () => void }) {
  const config = {
    added: { icon: "check", title: "Product Added!", bg: "bg-emerald-100", color: "text-emerald-600" },
    updated: { icon: "check", title: "Product Updated!", bg: "bg-blue-100", color: "text-blue-600" },
    deleted: { icon: "trash", title: "Product Deleted!", bg: "bg-red-100", color: "text-red-500" },
  }[info.type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-fade-in w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.bg}`}>
          {config.icon === "check" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={config.color}><path d="M20 6 9 17l-5-5" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={config.color}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{config.title}</h3>
        <p className="mt-1.5 text-sm text-gray-500">
          {info.type === "added" && <><strong>{info.name}</strong> has been added to your product catalog.</>}
          {info.type === "updated" && <><strong>{info.name}</strong> has been updated successfully.</>}
          {info.type === "deleted" && <><strong>{info.name}</strong> has been removed from your catalog.</>}
        </p>
        <button type="button" onClick={onClose} className={`mt-5 rounded-lg px-6 py-2 text-sm font-medium text-white ${info.type === "deleted" ? "bg-red-500 hover:bg-red-600" : info.type === "updated" ? "bg-blue-500 hover:bg-blue-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
          OK
        </button>
      </div>
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-700">{value}</p>
    </div>
  );
}

function AngleImageUploadField({
  label,
  image,
  onChange,
}: {
  label: string;
  image?: string;
  onChange: (url: string | undefined) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal upload gambar");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {image ? (
        <div className="relative h-20 w-20">
          <div className="h-full w-full overflow-hidden rounded-lg bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={label} className="h-full w-full object-contain" />
          </div>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-center text-xs text-gray-400 hover:border-emerald-400 hover:text-emerald-500">
          {uploading ? "..." : "+ Upload"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      )}
      <span className="text-center text-[11px] text-gray-500">{label}</span>
    </div>
  );
}

function SpecsEditor({ specs, onChange }: { specs: ProductSpec[]; onChange: (s: ProductSpec[]) => void }) {
  const addSpec = () => onChange([...specs, { label: "", value: "" }]);
  const removeSpec = (i: number) => onChange(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, key: "label" | "value", val: string) => {
    const next = [...specs];
    const current = next[i];
    if (!current) return;
    next[i] = { label: current.label, value: current.value, [key]: val };
    onChange(next);
  };

  return (
    <Field label="Specifications">
      <div className="flex flex-col gap-2">
        {specs.map((spec, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={spec.label}
              onChange={(e) => updateSpec(i, "label", e.target.value)}
              className="admin-input"
              placeholder="Label (e.g. Steel)"
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) => updateSpec(i, "value", e.target.value)}
              className="admin-input"
              placeholder="Value (e.g. Aogami #2)"
            />
            <button type="button" onClick={() => removeSpec(i)} className="shrink-0 text-red-400 hover:text-red-600">✕</button>
          </div>
        ))}
        <button type="button" onClick={addSpec} className="self-start text-xs font-medium text-emerald-500 hover:underline">
          + Add spec
        </button>
      </div>
    </Field>
  );
}

function HighlightsEditor({ highlights, onChange }: { highlights: string[]; onChange: (h: string[]) => void }) {
  const addHighlight = () => onChange([...highlights, ""]);
  const removeHighlight = (i: number) => onChange(highlights.filter((_, idx) => idx !== i));
  const updateHighlight = (i: number, val: string) => {
    const next = [...highlights];
    next[i] = val;
    onChange(next);
  };

  return (
    <Field label="Highlights">
      <div className="flex flex-col gap-2">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={h}
              onChange={(e) => updateHighlight(i, e.target.value)}
              className="admin-input"
              placeholder="e.g. Aogami #2 carbon core, 62 HRC"
            />
            <button type="button" onClick={() => removeHighlight(i)} className="shrink-0 text-red-400 hover:text-red-600">✕</button>
          </div>
        ))}
        <button type="button" onClick={addHighlight} className="self-start text-xs font-medium text-emerald-500 hover:underline">
          + Add highlight
        </button>
      </div>
    </Field>
  );
}

// --- Icons ---

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    </svg>
  );
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
