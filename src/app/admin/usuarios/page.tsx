"use client";

import { useAdminUserMutations, useAdminUsers } from "@/hooks/use-admin";
import type {
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
  UserRole,
} from "@/lib/api/contracts";
import { useState } from "react";

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
};

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-2xs text-zinc-700">
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-2xs font-medium text-emerald-700">
        Ativo
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-medium text-amber-700">
      Inativo
    </span>
  );
}

interface UserModalProps {
  user?: AdminUser;
  onClose: () => void;
  onSave: (data: CreateAdminUserInput | UpdateAdminUserInput) => void;
  isPending: boolean;
}

function UserModal({ user, onClose, onSave, isPending }: UserModalProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "EDITOR");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (user) {
      const input: UpdateAdminUserInput = { name, role };
      onSave(input);
    } else {
      const input: CreateAdminUserInput = { name, email, password, role };
      onSave(input);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-6 font-sans-condensed text-2xl font-black uppercase text-brand-dark">
          {user ? "Editar Usuário" : "Novo Usuário"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          {!user && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Perfil
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="EDITOR">Editor</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-300 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-md bg-brand py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsuariosPage() {
  const users = useAdminUsers();
  const { create, update } = useAdminUserMutations();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>();

  function openCreate() {
    setEditingUser(undefined);
    setModalOpen(true);
  }

  function openEdit(user: AdminUser) {
    setEditingUser(user);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingUser(undefined);
  }

  function handleSave(data: CreateAdminUserInput | UpdateAdminUserInput) {
    if (editingUser) {
      update.mutate(
        { id: editingUser.id, input: data as UpdateAdminUserInput },
        { onSuccess: closeModal },
      );
    } else {
      create.mutate(data as CreateAdminUserInput, { onSuccess: closeModal });
    }
  }

  function toggleActive(user: AdminUser) {
    update.mutate({ id: user.id, input: { is_active: !user.is_active } });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-sans-condensed text-4xl font-black uppercase text-brand-dark">
            Usuários
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gerencie os acessos ao painel administrativo.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Novo usuário
        </button>
      </header>

      {users.isLoading && (
        <p className="text-sm text-zinc-500">Carregando...</p>
      )}

      {users.isError && (
        <p className="text-sm text-red-600">Erro ao carregar usuários.</p>
      )}

      {users.data && (
        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">
                  Nome
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">
                  Perfil
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-600">
                  Último acesso
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.data.items.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-brand-dark">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={user.is_active} />
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="text-xs font-medium text-brand hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleActive(user)}
                        className="text-xs font-medium text-zinc-500 hover:underline"
                      >
                        {user.is_active ? "Desativar" : "Ativar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <UserModal
          user={editingUser}
          onClose={closeModal}
          onSave={handleSave}
          isPending={create.isPending || update.isPending}
        />
      )}
    </div>
  );
}
