import type { Product, ProductSpec } from "@/entities/product";
import type {
  KnifeAccessory,
  KnifeBlade,
  KnifeHandle,
  KnifeShape,
} from "@/entities/configurator";
import type { Review } from "@/entities/review";
import { tokenStorage } from "@/entities/session/model/token-storage";

import { apiFetch, apiFetchPaginated } from "./client";
import type {
  ApiAuthResponse,
  ApiCategory,
  ApiCollection,
  ApiCoupon,
  ApiKnifeAccessory,
  ApiKnifeBlade,
  ApiKnifeHandle,
  ApiKnifeShape,
  ApiOrder,
  ApiProduct,
  ApiReview,
  ApiUser,
} from "./types";

// ── Mappers: API (snake_case) → Frontend (camelCase) ──

function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compare_at_price || undefined,
    currency: "IDR",
    rating: p.rating,
    reviewCount: p.review_count,
    badge: p.badge as Product["badge"],
    maker: p.maker || undefined,
    stock: p.stock,
    category: p.category_name || "",
    highlights: p.highlights?.map((h) => h.text),
    specs: p.specs?.map(
      (s): ProductSpec => ({ label: s.label, value: s.value }),
    ),
    galleryLabels: p.images?.map((img) => img.alt),
    image: p.images?.[0]?.url,
  };
}

function mapReview(r: ApiReview): Review {
  return {
    id: r.id,
    author: r.author,
    rating: r.rating,
    date: r.created_at,
    content: r.comment,
  };
}

function mapShape(s: ApiKnifeShape): KnifeShape {
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    image: s.image_url || undefined,
    silhouetteLight: s.image_url || undefined,
    silhouetteDark: s.image_url || undefined,
  };
}

function mapBlade(b: ApiKnifeBlade): KnifeBlade {
  return {
    id: b.id,
    shapeId: b.shape_id,
    name: b.name,
    steel: b.steel,
    lengthMm: b.length_mm,
    price: b.price,
    compareAtPrice: b.compare_at_price || undefined,
    image: b.image_url || undefined,
  };
}

function mapHandle(h: ApiKnifeHandle): KnifeHandle {
  return {
    id: h.id,
    name: h.name,
    material: h.material,
    priceDelta: h.price_delta,
    image: h.image_url || undefined,
  };
}

function mapAccessory(a: ApiKnifeAccessory): KnifeAccessory {
  return {
    id: a.id,
    name: a.name,
    price: a.price,
    image: a.image_url || undefined,
  };
}

// ── Query-string helper ──

function qs(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ── Auth ──

export async function login(email: string, password: string) {
  const data = await apiFetch<ApiAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  tokenStorage.save(data.tokens, data.user);
  return data;
}

export async function register(
  email: string,
  password: string,
  fullName: string,
) {
  const data = await apiFetch<ApiAuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: fullName }),
  });
  tokenStorage.save(data.tokens, data.user);
  return data;
}

export async function getProfile() {
  return apiFetch<ApiUser>("/auth/me");
}

export function logout() {
  tokenStorage.clear();
}

// ── Products ──

export interface ProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  badge?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: string;
}

export async function fetchProducts(params?: ProductListParams) {
  const result = await apiFetchPaginated<ApiProduct[]>(
    `/products${qs(params as Record<string, string | number | undefined>)}`,
  );
  return {
    products: (result.data || []).map(mapProduct),
    meta: result.meta,
  };
}

export async function fetchProductBySlug(slug: string) {
  const data = await apiFetch<ApiProduct>(`/products/${slug}`);
  return mapProduct(data);
}

export async function fetchFeaturedProducts() {
  const data = await apiFetch<ApiProduct[]>("/products/featured");
  return (data || []).map(mapProduct);
}

export async function fetchNewArrivals() {
  const data = await apiFetch<ApiProduct[]>("/products/new-arrivals");
  return (data || []).map(mapProduct);
}

// ── Categories ──

export async function fetchCategories() {
  return apiFetch<ApiCategory[]>("/categories");
}

// ── Collections ──

export async function fetchCollections() {
  return apiFetch<ApiCollection[]>("/collections");
}

export async function fetchCollectionByHandle(handle: string) {
  const data = await apiFetch<{
    collection: ApiCollection;
    products: ApiProduct[];
  }>(`/collections/${handle}`);
  return {
    collection: data.collection,
    products: (data.products || []).map(mapProduct),
  };
}

// ── Reviews ──

export async function fetchProductReviews(slug: string) {
  const data = await apiFetch<ApiReview[]>(`/products/${slug}/reviews`);
  return (data || []).map(mapReview);
}

export async function submitReview(
  slug: string,
  payload: { author: string; rating: number; content: string },
) {
  const data = await apiFetch<ApiReview>(`/products/${slug}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapReview(data);
}

// ── Configurator ──

export async function fetchShapes() {
  const data = await apiFetch<ApiKnifeShape[]>("/configurator/shapes");
  return (data || []).map(mapShape);
}

export async function fetchBlades(shapeId?: string) {
  const data = await apiFetch<ApiKnifeBlade[]>(
    `/configurator/blades${qs({ shape_id: shapeId })}`,
  );
  return (data || []).map(mapBlade);
}

export async function fetchHandles() {
  const data = await apiFetch<ApiKnifeHandle[]>("/configurator/handles");
  return (data || []).map(mapHandle);
}

export async function fetchAccessories() {
  const data = await apiFetch<ApiKnifeAccessory[]>(
    "/configurator/accessories",
  );
  return (data || []).map(mapAccessory);
}

// ── Checkout ──

export interface CheckoutItem {
  slug: string;
  quantity: number;
  component_kind?: string;
  component_ref?: string;
}

export interface CheckoutPayload {
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  notes?: string;
  coupon_code?: string;
  items: CheckoutItem[];
}

export async function checkout(payload: CheckoutPayload) {
  return apiFetch<ApiOrder>("/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Coupons ──

export async function validateCoupon(code: string, subtotal: number) {
  return apiFetch<ApiCoupon>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

// ── Newsletter ──

export async function subscribeNewsletter(email: string) {
  return apiFetch<null>("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// ── Orders (authenticated) ──

export async function fetchUserOrders(page = 1, perPage = 10) {
  return apiFetchPaginated<ApiOrder[]>(
    `/orders${qs({ page, per_page: perPage })}`,
  );
}

export async function fetchOrderById(id: string) {
  return apiFetch<ApiOrder>(`/orders/${id}`);
}
