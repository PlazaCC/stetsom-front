import type { AdminUser } from "@/lib/api/contracts";

// MOCK ONLY: dev fallback — remove when Fastify auth is integrated
export const MOCK_AUTH_PASSWORD =
  process.env.MOCK_ADMIN_PASSWORD ?? "stetsom2026";

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-1",
    name: "Admin Stetsom",
    email: "admin@stetsom.com.br",
    role: "SUPER_ADMIN",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-05-19T00:00:00.000Z",
    last_login: "2026-05-19T10:30:00.000Z",
  },
  {
    id: "usr-2",
    name: "Editor Stetsom",
    email: "editor@stetsom.com.br",
    role: "EDITOR",
    is_active: true,
    created_at: "2026-02-15T00:00:00.000Z",
    updated_at: "2026-05-10T00:00:00.000Z",
    last_login: "2026-05-15T08:00:00.000Z",
  },
  {
    id: "usr-3",
    name: "Admin Inativo",
    email: "antigo@stetsom.com.br",
    role: "ADMIN",
    is_active: false,
    created_at: "2025-06-01T00:00:00.000Z",
    updated_at: "2026-01-20T00:00:00.000Z",
  },
];
