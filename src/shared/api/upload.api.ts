import { tokenStorage } from "@/entities/session/model/token-storage";
import { env } from "@/shared/config/env";
import { HttpError } from "./http-error";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // must match backend maxUploadSize

// Downscales + re-encodes as JPEG so oversized photos (e.g. raw smartphone
// shots) don't get rejected by the backend's 5MB cap. Only touches files
// that are actually over the limit; anything already small enough is sent
// as-is (keeps PNG transparency etc. intact).
// ponytail: single-pass quality/dimension reduction, not a binary-search fit —
// good enough for typical photos, may still exceed the cap for pathological
// inputs (e.g. huge flat-color PNGs that don't compress well as JPEG).
export async function compressImage(file: File, maxBytes = MAX_UPLOAD_BYTES): Promise<File> {
  if (file.size <= maxBytes || typeof document === "undefined") return file;

  const bitmap = await createImageBitmap(file);
  const maxDim = 2560;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  let blob: Blob | null = null;
  for (let quality = 0.85; quality >= 0.3; quality -= 0.15) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= maxBytes) break;
  }
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}

export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const form = new FormData();
  form.append("image", compressed);

  let base = env.apiBaseUrl;
  if (typeof window !== "undefined" && base.startsWith("/")) {
    base = `${window.location.origin}${base}`;
  }

  const res = await fetch(`${base}/admin/uploads/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenStorage.getAccessToken()}` },
    body: form,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new HttpError(res.status, json?.message ?? "Upload failed");
  return json.data.url as string;
}
