import { AdminPanel } from "../admin-panel";
import { AdminPageHeader } from "../admin-page-header";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminListPageProps {
  title: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminListPage({
  title,
  icon,
  action,
  toolbar,
  children,
  className,
}: AdminListPageProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <AdminPanel className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <AdminPageHeader title={title} icon={icon} />
          {action}
        </div>
        {toolbar && <div>{toolbar}</div>}
        {children}
      </AdminPanel>
    </div>
  );
}
