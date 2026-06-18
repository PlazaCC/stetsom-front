import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  icon: Icon,
  action,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between border-b py-5 lg:px-11.75",
        className,
      )}
    >
      {/* <div className="flex items-center gap-3">
              {mode === "edit" && productId && (
                <AdminDeleteAction
                  label="Excluir produto"
                  confirmTitle={`Excluir "${info.name.pt}"?`}
                  confirmDescription="O produto será removido permanentemente. Esta ação não pode ser desfeita."
                  confirmLabel="Sim, excluir"
                  onConfirm={handleDelete}
                  isLoading={deleteMutation.isPending}
                />
              )}
              <Link
                href="/admin/produtos"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                ← Voltar
              </Link>
            </div> */}

      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-7 text-foreground/40" />}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
