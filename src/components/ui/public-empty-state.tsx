import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PublicEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PublicEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: Readonly<PublicEmptyStateProps>) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-64 flex-col items-center justify-center border border-dashed border-border bg-white px-6 py-10 text-center",
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-brand/10">
        <Icon className="size-8 text-brand" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-sans-condensed text-xl font-bold text-brand-dark uppercase">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-text-subtle">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
