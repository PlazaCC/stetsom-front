import { AdminPanel } from "../admin-panel";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminListPageProps {
  /**
   * @deprecated The page title and icon are now rendered by the shell header
   * (`AdminShellHeader`) from `@/lib/cms/config`. Kept optional for call-site
   * compatibility; remove during the layout pass.
   */
  title?: string;
  /** @deprecated See `title`. */
  icon?: LucideIcon;
  action?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminListPage({
  action,
  toolbar,
  children,
  className,
}: AdminListPageProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <AdminPanel className="flex flex-col gap-4">
        {action && (
          <div className="flex items-center justify-end">{action}</div>
        )}
        {toolbar && <div>{toolbar}</div>}
        {children}
      </AdminPanel>
    </div>
  );
}
