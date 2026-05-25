"use client";

import type {
  AdminDashboardPayload,
  AdminUser,
  AdminUsersPayload,
  AuditPayload,
  BannersPayload,
  CmsConfig,
  ContactMessagesPayload,
  CreateAdminUserInput,
  LibraryAssetType,
  LibraryPayload,
  LoginCredentials,
  UpdateAdminUserInput,
} from "@/lib/api/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function proxyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () =>
      proxyFetch<AdminDashboardPayload>("/api/proxy/admin/dashboard"),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => proxyFetch<AdminUsersPayload>("/api/proxy/admin/users"),
  });
}

export function useAdminLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Falha ao autenticar.");
      }
      return res.json() as Promise<{ ok: true }>;
    },
    onSuccess: () => {
      router.push("/admin");
      router.refresh();
    },
  });
}

export function useAdminLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Falha ao encerrar sessão.");
      }
    },
    onSuccess: () => {
      router.push("/admin/login");
      router.refresh();
    },
  });
}

export function useAdminUserMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const create = useMutation({
    mutationFn: (input: CreateAdminUserInput) =>
      proxyFetch<AdminUser>("/api/proxy/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAdminUserInput }) =>
      proxyFetch<AdminUser>(`/api/proxy/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: invalidate,
  });

  return { create, update };
}

export function useAdminBanners() {
  return useQuery({
    queryKey: ["admin", "banners"],
    queryFn: () => proxyFetch<BannersPayload>("/api/proxy/admin/banners"),
    select: (data) => data.items,
  });
}

export function useAdminLibrary(type?: LibraryAssetType) {
  const suffix = type ? `?type=${encodeURIComponent(type)}` : "";
  return useQuery({
    queryKey: ["admin", "library", type ?? "all"],
    queryFn: () =>
      proxyFetch<LibraryPayload>(`/api/proxy/admin/library${suffix}`),
    select: (data) => data.items,
  });
}

export function useAdminMessages() {
  return useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () =>
      proxyFetch<ContactMessagesPayload>("/api/proxy/admin/messages"),
    select: (data) => data.items,
  });
}

export function useAdminAuditLog() {
  return useQuery({
    queryKey: ["admin", "audit"],
    queryFn: () => proxyFetch<AuditPayload>("/api/proxy/admin/audit"),
    select: (data) => data.items,
  });
}

export function useAdminConfig() {
  return useQuery({
    queryKey: ["admin", "config"],
    queryFn: () => proxyFetch<CmsConfig>("/api/proxy/admin/config"),
  });
}
