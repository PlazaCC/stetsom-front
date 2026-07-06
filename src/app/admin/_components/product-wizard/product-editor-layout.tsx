import { cn } from "@/lib/utils";

interface ProductEditorLayoutProps {
  /** The live preview canvas. Fills the left, owns its own internal scroll. */
  preview: React.ReactNode;
  /** The contextual panel on the right. 320px in desktop mode, 480px in mobile. */
  panel: React.ReactNode;
  /** Controls the panel width: wider when the preview is in mobile (375px) mode. */
  device?: "mobile" | "desktop";
  className?: string;
}

/**
 * Elementor-style split editor. The preview is the working canvas on the left
 * (full width, full height, its own scroll); the contextual panel is a fixed
 * 320px column on the right, divided by a border with no gap. Fills the admin
 * shell `<main>` without making it scroll — see `admin-shell-scroll.md`.
 *
 * When `device === "mobile"` the preview canvas shows a narrow 375px iframe,
 * so the panel expands to 480px to reclaim the unused canvas space.
 */
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
          device === "mobile" ? "min-w-0 flex-1" : "w-80 shrink-0",
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
