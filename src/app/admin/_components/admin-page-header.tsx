import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";

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
        "flex w-full items-center justify-between border-b py-1 lg:px-11.75",
        className,
      )}
    >
      <div className="flex flex-1 gap-2">
        <Link
          href="/admin/produtos"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Button size="icon-sm" variant="ghost">
            <ChevronLeft />
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-7 text-foreground/40" />}
          <h1 className="text font-bold text-foreground">{title}</h1>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
