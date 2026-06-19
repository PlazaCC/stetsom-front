import { cn } from "@/lib/utils";

interface ProductEditorLayoutProps {
  /** The live preview canvas. Fills the left, owns its own internal scroll. */
  preview: React.ReactNode;
  /** The 320px contextual panel on the right. */
  panel: React.ReactNode;
  className?: string;
}

/**
 * Elementor-style split editor. The preview is the working canvas on the left
 * (full width, full height, its own scroll); the contextual panel is a fixed
 * 320px column on the right, divided by a border with no gap. Fills the admin
 * shell `<main>` without making it scroll — see `admin-shell-scroll.md`.
 */
export function ProductEditorLayout({
  preview,
  panel,
  className,
}: ProductEditorLayoutProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 overflow-hidden", className)}>
      <div className="min-w-0 flex-1 overflow-hidden">{preview}</div>
      <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-l border-border bg-card">
        {panel}
      </aside>
    </div>
  );
}
