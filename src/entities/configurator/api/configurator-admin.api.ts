import { apiFetch } from "@/shared/api/client";
import { env } from "@/shared/config/env";
import { tokenStorage } from "@/entities/session/model/token-storage";

// --- Types ---

export interface ShapeItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  sort_order: number;
}

export interface BladeItem {
  id: string;
  shape_id: string;
  name: string;
  steel: string;
  length_mm: number;
  price: number;
  compare_at_price?: number;
  description?: string;
  specifications?: Record<string, string>;
  image_url?: string;
  sort_order: number;
}

export interface HandleItem {
  id: string;
  name: string;
  material: string;
  price_delta: number;
  image_url?: string;
  sort_order: number;
}

export interface AccessoryItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  sort_order: number;
}

// --- Image Upload ---

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const token = tokenStorage.getAccessToken();
  const res = await fetch(`${env.apiBaseUrl}/admin/uploads/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.data.url;
}

// --- Shapes ---

export const listShapes = () => apiFetch<ShapeItem[]>("/admin/configurator/shapes");
export const createShape = (data: Omit<ShapeItem, "id">) =>
  apiFetch<ShapeItem>("/admin/configurator/shapes", { method: "POST", body: JSON.stringify(data) });
export const updateShape = (id: string, data: Partial<ShapeItem>) =>
  apiFetch<ShapeItem>(`/admin/configurator/shapes/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteShape = (id: string) =>
  apiFetch<null>(`/admin/configurator/shapes/${id}`, { method: "DELETE" });

// --- Blades ---

export const listBlades = () => apiFetch<BladeItem[]>("/admin/configurator/blades");
export const createBlade = (data: Omit<BladeItem, "id">) =>
  apiFetch<BladeItem>("/admin/configurator/blades", { method: "POST", body: JSON.stringify(data) });
export const updateBlade = (id: string, data: Partial<BladeItem>) =>
  apiFetch<BladeItem>(`/admin/configurator/blades/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteBlade = (id: string) =>
  apiFetch<null>(`/admin/configurator/blades/${id}`, { method: "DELETE" });

// --- Handles ---

export const listHandles = () => apiFetch<HandleItem[]>("/admin/configurator/handles");
export const createHandle = (data: Omit<HandleItem, "id">) =>
  apiFetch<HandleItem>("/admin/configurator/handles", { method: "POST", body: JSON.stringify(data) });
export const updateHandle = (id: string, data: Partial<HandleItem>) =>
  apiFetch<HandleItem>(`/admin/configurator/handles/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteHandle = (id: string) =>
  apiFetch<null>(`/admin/configurator/handles/${id}`, { method: "DELETE" });

// --- Accessories ---

export const listAccessories = () => apiFetch<AccessoryItem[]>("/admin/configurator/accessories");
export const createAccessory = (data: Omit<AccessoryItem, "id">) =>
  apiFetch<AccessoryItem>("/admin/configurator/accessories", { method: "POST", body: JSON.stringify(data) });
export const updateAccessory = (id: string, data: Partial<AccessoryItem>) =>
  apiFetch<AccessoryItem>(`/admin/configurator/accessories/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteAccessory = (id: string) =>
  apiFetch<null>(`/admin/configurator/accessories/${id}`, { method: "DELETE" });
