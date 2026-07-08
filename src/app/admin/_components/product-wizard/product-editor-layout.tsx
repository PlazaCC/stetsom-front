import { cn } from "@/lib/utils";

interface ProductEditorLayoutProps {
  preview: React.ReactNode;
  panel: React.ReactNode;
  device?: "mobile" | "desktop";
  className?: string;
}

export function ProductEditorLayout({
  preview,
  panel,
  device = "desktop",
  className,
}: ProductEditorLayoutProps) {
  return (
    <div
      className={cn("flex h-full min-h-0 flex-1 overflow-hidden", className)}
    >
      <aside
        className={cn(
          "flex flex-col overflow-hidden border-l border-border bg-card transition-[width] duration-200",
          device === "mobile" ? "min-w-0 flex-1" : "w-120 min-w-96 shrink-0",
        )}
      >
        {panel}
      </aside>
      <div
        className={cn(
          "overflow-hidden",
          device === "mobile" ? "w-[411px] shrink-0" : "min-w-0 flex-1",
        )}
      >
        {preview}
      </div>
    </div>
  );
}
