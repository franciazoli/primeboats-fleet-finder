import type { Boat } from "@/data/boats";
import type { Inquiry, InquiryStatus } from "@/data/inquiries";

const BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: isFormData ? undefined : { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Request failed");
  return json.data as T;
}

// ── Public ────────────────────────────────────────────────────────────────────

export function fetchBoats(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return request<Boat[]>(`/boats.php${qs}`);
}

export function fetchBoat(slug: string) {
  return request<Boat>(`/boats.php?slug=${encodeURIComponent(slug)}`);
}

export function submitInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  boatId?: string;
}) {
  return request<{ message: string }>("/inquiries.php", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Admin auth ────────────────────────────────────────────────────────────────

export function adminLogin(username: string, password: string) {
  return request<{ username: string }>("/admin/login.php", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function adminLogout() {
  return request<{ message: string }>("/admin/logout.php", { method: "POST" });
}

export function adminMe() {
  return request<{ username: string }>("/admin/me.php");
}

// ── Admin boats ───────────────────────────────────────────────────────────────

export function adminFetchBoats(search?: string) {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return request<Boat[]>(`/admin/boats.php${qs}`);
}

export function adminCreateBoat(data: Omit<Boat, "id">) {
  return request<Boat>("/admin/boats.php", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminUpdateBoat(data: Boat) {
  return request<Boat>("/admin/boats.php", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function adminDeleteBoat(id: string) {
  return request<{ deleted: number }>(`/admin/boats.php?id=${id}`, { method: "DELETE" });
}

export function adminUploadImage(file: File) {
  const form = new FormData();
  form.append("image", file);
  return request<{ filename: string; url: string }>("/admin/upload.php", {
    method: "POST",
    body: form,
  });
}

// ── Admin inquiries ───────────────────────────────────────────────────────────

export function adminFetchInquiries(status?: string) {
  const qs = status && status !== "all" ? `?status=${status}` : "";
  return request<Inquiry[]>(`/admin/inquiries.php${qs}`);
}

export function adminUpdateInquiry(id: string, status: InquiryStatus) {
  return request<{ id: string; status: string }>("/admin/inquiries.php", {
    method: "PATCH",
    body: JSON.stringify({ id, status }),
  });
}

export function adminDeleteInquiry(id: string) {
  return request<{ deleted: number }>(`/admin/inquiries.php?id=${id}`, { method: "DELETE" });
}
