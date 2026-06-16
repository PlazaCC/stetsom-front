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
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-7 text-foreground/40" />}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
