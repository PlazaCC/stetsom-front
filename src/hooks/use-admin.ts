"use client";

import { fetchAdminDashboard } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
  });
}
