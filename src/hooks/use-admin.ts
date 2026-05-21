"use client";

import {
  createAdminUser,
  fetchAdminAuditLog,
  fetchAdminBanners,
  fetchAdminConfig,
  fetchAdminDashboard,
  fetchAdminLibrary,
  fetchAdminMessages,
  fetchAdminUsers,
  loginAdmin,
  logoutAdmin,
  updateAdminUser,
} from "@/lib/api/client";
import type {
  CreateAdminUserInput,
  LibraryAssetType,
  LoginCredentials,
  UpdateAdminUserInput,
} from "@/lib/api/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
  });
}

export function useAdminLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginAdmin(credentials),
    onSuccess: () => {
      router.push("/admin");
      router.refresh();
    },
  });
}

export function useAdminLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: logoutAdmin,
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
    mutationFn: (input: CreateAdminUserInput) => createAdminUser(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAdminUserInput }) =>
      updateAdminUser(id, input),
    onSuccess: invalidate,
  });

  return { create, update };
}

export function useAdminBanners() {
  return useQuery({
    queryKey: ["admin", "banners"],
    queryFn: fetchAdminBanners,
  });
}

export function useAdminLibrary(type?: LibraryAssetType) {
  return useQuery({
    queryKey: ["admin", "library", type ?? "all"],
    queryFn: () => fetchAdminLibrary(type),
  });
}

export function useAdminMessages() {
  return useQuery({
    queryKey: ["admin", "messages"],
    queryFn: fetchAdminMessages,
  });
}

export function useAdminAuditLog() {
  return useQuery({
    queryKey: ["admin", "audit"],
    queryFn: fetchAdminAuditLog,
  });
}

export function useAdminConfig() {
  return useQuery({
    queryKey: ["admin", "config"],
    queryFn: fetchAdminConfig,
  });
}
