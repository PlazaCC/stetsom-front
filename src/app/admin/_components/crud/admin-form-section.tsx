import { cn } from "@/lib/utils";

interface AdminFormSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function AdminFormSection({
  children,
  className,
  title,
  description,
}: AdminFormSectionProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col overflow-hidden rounded-[16px] border border-border bg-card",
        className,
      )}
    >
      {(title || description) && (
        <AdminFormSectionTitle title={title} description={description} />
      )}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export function AdminFormSectionTitle({
  title,
  description,
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-border px-6 py-2.5", className)}>
      {title && (
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      )}

      {description && (
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function AdminFormSectionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 px-6 py-4", className)}>
      {children}
    </div>
  );
}

// export function AdminFormSectionContentSubtitleSeparator({
//   className,
//   children,
// }: {
//   className: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className={cn("border-y border-border px-6 py-2", className)}>
//       <h2 className="text-sm font-semibold text-foreground">{children}</h2>
//     </div>
//   );
// }
