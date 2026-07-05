"use client";

import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

interface LibraryDropzoneProps {
  /** Called with the accepted files dropped anywhere inside the zone. */
  onDrop: (files: File[]) => void;
  /** Comma-separated MIME / extension list used to filter dropped files. */
  accept: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Whether a file matches one token of an `accept` string (MIME, `type/*` or `.ext`). */
function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

/**
 * Wraps the whole library content area so a file dragged anywhere over it is
 * uploaded. A drag counter prevents the overlay from flickering as the pointer
 * moves across nested children. Non-file drags (text, elements) are ignored.
 */
export function LibraryDropzone({
  onDrop,
  accept,
  disabled,
  className,
  children,
}: LibraryDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);

  function reset() {
    depth.current = 0;
    setDragging(false);
  }

  function hasFiles(e: React.DragEvent) {
    return Array.from(e.dataTransfer.types).includes("Files");
  }

  return (
    <div
      className={cn("relative", className)}
      onDragEnter={(e) => {
        if (disabled || !hasFiles(e)) return;
        e.preventDefault();
        depth.current += 1;
        setDragging(true);
      }}
      onDragOver={(e) => {
        if (disabled || !hasFiles(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={() => {
        if (disabled) return;
        depth.current -= 1;
        if (depth.current <= 0) reset();
      }}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        reset();
        const files = Array.from(e.dataTransfer.files).filter((f) =>
          matchesAccept(f, accept),
        );
        if (files.length > 0) onDrop(files);
      }}
    >
      {children}

      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary bg-primary/5 backdrop-blur-xs">
          <UploadCloud className="size-10 text-primary" />
          <p className="text-sm font-medium text-foreground">
            Solte para enviar à biblioteca
          </p>
        </div>
      )}
    </div>
  );
}
