import { tokenStorage } from "@/entities/session/model/token-storage";
import { env } from "@/shared/config/env";
import { HttpError } from "./http-error";

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${env.apiBaseUrl}/admin/uploads/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenStorage.getAccessToken()}` },
    body: form,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new HttpError(res.status, json?.message ?? "Upload failed");
  return json.data.url as string;
}
