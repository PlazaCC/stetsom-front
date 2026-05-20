import { cn } from "@/lib/utils";

interface AdminFormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormSection({
  title,
  description,
  children,
  className,
}: AdminFormSectionProps) {
  return (
    <div
      className={cn("rounded-[16px] border border-border bg-card", className)}
    >
      {(title || description) && (
        <div className="border-b border-border px-6 py-4">
          {title && (
            <h2 className="font-mono text-sm font-semibold text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
