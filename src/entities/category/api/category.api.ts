import { apiFetch } from "@/shared/api/client";

export interface CategoryApiItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface CategoryInput {
  name: string;
  description?: string;
  image_url?: string;
}

export function listCategories() {
  return apiFetch<CategoryApiItem[]>("/categories");
}

export function getCategoryBySlug(slug: string) {
  return apiFetch<CategoryApiItem>(`/categories/${slug}`);
}

export function createCategory(input: CategoryInput) {
  return apiFetch<CategoryApiItem>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCategory(id: string, input: Partial<CategoryInput>) {
  return apiFetch<CategoryApiItem>(`/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: string) {
  return apiFetch<null>(`/admin/categories/${id}`, { method: "DELETE" });
}