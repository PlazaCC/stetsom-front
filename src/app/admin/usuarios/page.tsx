"use client";

import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import {
  getGetApiUsersQueryKey,
  useGetApiUsers,
  postApiUsers,
  patchApiUsersId,
} from "@/api/stetsom";
import type {
  AdminUser,
  PostApiUsersBody,
  PatchApiUsersIdBody,
  UserRole,
} from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
};

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground">
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-xs font-medium",
        active
          ? "border-cms-step-done bg-cms-step-done text-white"
          : "border-cms-step-pending bg-cms-step-pending text-muted-foreground",
      )}
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

interface UserFormProps {
  user?: AdminUser;
  onClose: () => void;
  onSave: (data: PostApiUsersBody | PatchApiUsersIdBody) => void;
  isPending: boolean;
}

function UserForm({ user, onClose, onSave, isPending }: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "EDITOR");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (user) {
      onSave({ name, role } satisfies PatchApiUsersIdBody);
    } else {
      onSave({ name, email, password, role } satisfies PostApiUsersBody);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4">
      <div className="w-full max-w-md">
        <AdminFormSection
          title={user ? "Editar Usuário" : "Novo Usuário"}
          className="shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <AdminLabel>Nome</AdminLabel>
              <AdminInput
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {!user && (
              <>
                <div>
                  <AdminLabel>E-mail</AdminLabel>
                  <AdminInput
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <AdminLabel>Senha</AdminLabel>
                  <AdminInput
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <AdminLabel>Perfil</AdminLabel>
              <AdminSelect
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
              </AdminSelect>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-md bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </AdminFormSection>
      </div>
    </div>
  );
}

export default function AdminUsuariosPage() {
  const queryClient = useQueryClient();
  const users = useGetApiUsers();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiUsersQueryKey() });
  }

  const createMutation = useMutation({
    mutationFn: (body: PostApiUsersBody) => postApiUsers(body),
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchApiUsersIdBody }) =>
      patchApiUsersId(id, body),
    onSuccess: invalidate,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>();
  const [toggleTarget, setToggleTarget] = useState<AdminUser | undefined>();

  function openCreate() {
    setEditingUser(undefined);
    setFormOpen(true);
  }

  function openEdit(user: AdminUser) {
    setEditingUser(user);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingUser(undefined);
  }

  function handleSave(data: PostApiUsersBody | PatchApiUsersIdBody) {
    if (editingUser) {
      updateMutation.mutate(
        { id: editingUser.id, body: data as PatchApiUsersIdBody },
        { onSuccess: closeForm },
      );
    } else {
      createMutation.mutate(data as PostApiUsersBody, { onSuccess: closeForm });
    }
  }

  const columns: AdminTableColumn<AdminUser>[] = [
    {
      key: "name",
      header: "Nome",
      render: (u) => (
        <span className="font-medium text-foreground">{u.name}</span>
      ),
    },
    {
      key: "email",
      header: "E-mail",
      render: (u) => <span className="text-muted-foreground">{u.email}</span>,
    },
    {
      key: "role",
      header: "Perfil",
      render: (u) => <RoleBadge role={u.role} />,
    },
    {
      key: "is_active",
      header: "Status",
      render: (u) => <StatusBadge active={u.is_active} />,
    },
    {
      key: "last_login",
      header: "Último acesso",
      render: (u) => (
        <span className="text-muted-foreground">
          {u.last_login
            ? new Date(u.last_login).toLocaleDateString("pt-BR")
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (u) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => openEdit(u)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setToggleTarget(u)}
            className="text-xs font-medium text-muted-foreground hover:underline"
          >
            {u.is_active ? "Desativar" : "Ativar"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminListPage
        title="Usuários"
        icon={Users}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            <Plus className="size-4" />
            Novo usuário
          </button>
        }
      >
        <AdminDataTable
          columns={columns}
          data={users.data?.items ?? []}
          isLoading={users.isLoading}
          keyExtractor={(u) => u.id}
          emptyTitle="Nenhum usuário cadastrado"
          emptyDescription="Crie um usuário para dar acesso ao painel."
        />
      </AdminListPage>

      {formOpen && (
        <UserForm
          user={editingUser}
          onClose={closeForm}
          onSave={handleSave}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <AdminConfirmDialog
        open={!!toggleTarget}
        title={
          toggleTarget?.is_active ? "Desativar usuário?" : "Ativar usuário?"
        }
        description={`${toggleTarget?.name} ${toggleTarget?.is_active ? "não terá mais acesso ao painel" : "poderá acessar o painel novamente"}.`}
        confirmLabel={toggleTarget?.is_active ? "Desativar" : "Ativar"}
        destructive={toggleTarget?.is_active}
        isPending={updateMutation.isPending}
        onConfirm={() => {
          if (!toggleTarget) return;
          updateMutation.mutate(
            {
              id: toggleTarget.id,
              body: { is_active: !toggleTarget.is_active },
            },
            { onSuccess: () => setToggleTarget(undefined) },
          );
        }}
        onCancel={() => setToggleTarget(undefined)}
      />
    </>
  );
}
