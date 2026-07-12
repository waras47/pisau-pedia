import { apiFetch } from "@/shared/api/client";

export type ServiceRequestType = "sharpening" | "engraving";
export type ServiceRequestStatus = "pending" | "in_progress" | "completed" | "rejected";

export interface ServiceRequestResponse {
  id: string;
  type: ServiceRequestType;
  status: ServiceRequestStatus;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  message: string;
  quoted_price?: number;
  admin_notes?: string;
  created_at: string;
}

export interface CreateServiceRequestInput {
  type: ServiceRequestType;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  message: string;
}

export function createServiceRequest(input: CreateServiceRequestInput) {
  return apiFetch<ServiceRequestResponse>("/service-requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listServiceRequests(type: ServiceRequestType, status?: string) {
  const params = new URLSearchParams({ type, per_page: "50" });
  if (status) params.set("status", status);
  return apiFetch<ServiceRequestResponse[]>(`/admin/service-requests?${params.toString()}`);
}

export function getServiceRequest(id: string) {
  return apiFetch<ServiceRequestResponse>(`/admin/service-requests/${id}`);
}

export interface UpdateServiceRequestInput {
  status?: ServiceRequestStatus;
  quoted_price?: number;
  admin_notes?: string;
}

export function updateServiceRequest(id: string, input: UpdateServiceRequestInput) {
  return apiFetch<ServiceRequestResponse>(`/admin/service-requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
