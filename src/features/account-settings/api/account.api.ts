import { apiFetch } from "@/shared/api/client";

import type { SessionUser } from "@/entities/session/model/session.types";

export interface UpdateProfileInput {
  full_name?: string;
  email?: string;
  phone?: string;
}

export function getMyProfile() {
  return apiFetch<SessionUser>("/users/me");
}

export function updateMyProfile(input: UpdateProfileInput) {
  return apiFetch<SessionUser>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function changeMyPassword(currentPassword: string, newPassword: string) {
  return apiFetch<null>("/users/me/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}
