"use client";

import { AdminConfirmDialog } from "@/app/admin/_components/crud/admin-confirm-dialog";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <AdminLabel>Nome</AdminLabel>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {!user && (
            <>
              <div>
                <AdminLabel>E-mail</AdminLabel>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <AdminLabel>Senha</AdminLabel>
                <Input
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
            <Select
              value={role}
              onValueChange={(value) => value && setRole(value as UserRole)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
      render: (u) => (
        <StatusBadge status={u.is_active ? "ACTIVE" : "INACTIVE"} />
      ),
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
        <AdminRowActions>
          <AdminRowAction onClick={() => openEdit(u)}>Editar</AdminRowAction>
          <AdminRowAction onClick={() => setToggleTarget(u)}>
            {u.is_active ? "Desativar" : "Ativar"}
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  return (
    <>
      <AdminPageLayout>
        <AdminDataTable
          columns={columns}
          data={users.data?.items ?? []}
          isLoading={users.isLoading}
          keyExtractor={(u) => u.id}
          emptyTitle="Nenhum usuário cadastrado"
          emptyDescription="Crie um usuário para dar acesso ao painel."
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
        />
      </AdminPageLayout>

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
