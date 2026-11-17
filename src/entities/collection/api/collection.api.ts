import { apiFetch } from "@/shared/api/client";
import { type CategoryApiItem } from "@/entities/category/api/category.api";

export interface CollectionApiItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  categories: CategoryApiItem[];
}

export interface CollectionInput {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
  category_ids?: string[];
}

export function listCollections() {
  return apiFetch<CollectionApiItem[]>("/collections");
}

export function getCollectionBySlug(slug: string) {
  return apiFetch<CollectionApiItem>(`/collections/${slug}`);
}

export function createCollection(input: CollectionInput) {
  return apiFetch<CollectionApiItem>("/admin/collections", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCollection(id: string, input: CollectionInput) {
  return apiFetch<CollectionApiItem>(`/admin/collections/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteCollection(id: string) {
  return apiFetch<null>(`/admin/collections/${id}`, { method: "DELETE" });
}
