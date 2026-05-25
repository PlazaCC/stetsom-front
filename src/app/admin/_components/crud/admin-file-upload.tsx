"use client";

import { cn } from "@/lib/utils";
import { Upload, X, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";

interface AdminFileUploadProps {
  /** Callback invoked when files are selected or dropped */
  onUpload?: (files: File[]) => void;
  /**
   * When `true`, clears the internal file list immediately after calling
   * `onUpload` — ideal for automatic upload where progress is shown externally.
   * Default: `false` (keeps files in the list for manual selection).
   */
  clearOnUpload?: boolean;
  accept?: string;
  multiple?: boolean;
  label?: string;
  description?: string;
  className?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export function AdminFileUpload({
  onUpload,
  clearOnUpload = false,
  accept,
  multiple = false,
  label = "Clique para fazer upload ou arraste o arquivo",
  description,
  className,
  icon: Icon = Upload,
  disabled = false,
}: AdminFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  function handleFiles(incoming: FileList | null) {
    if (!incoming || disabled) return;
    const list = Array.from(incoming);

    if (clearOnUpload) {
      onUpload?.(list);
    } else {
      setFiles((prev) => (multiple ? [...prev, ...list] : list));
      onUpload?.(list);
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onUpload?.(next);
      return next;
    });
  }

  return (
    <div className={cn("space-y-3", className)}>
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-card px-6 py-10 text-center transition-colors",
          isDragging && "border-brand bg-brand/5",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
      >
        <Icon className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Only show internal list when clearOnUpload is false */}
      {!clearOnUpload && files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
            >
              <span className="truncate text-sm text-foreground">
                {file.name}
              </span>
              <button
                type="button"
                aria-label="Remover arquivo"
                onClick={() => removeFile(index)}
                className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
