"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface AdminTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function AdminTextEditor({
  value,
  onChange,
  placeholder = "Digite o conteúdo...",
  rows = 6,
  className,
}: AdminTextEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <div className={cn("rounded-md border border-border", className)}>
      <div className="flex border-b border-border">
        {(["edit", "preview"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
            className={cn(
              "px-4 py-2 text-xs font-medium transition-colors",
              mode === tab
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab === "edit" ? "Editar" : "Pré-visualizar"}
          </button>
        ))}
      </div>

      {mode === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full resize-none bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      ) : (
        <div className="min-h-24 whitespace-pre-wrap p-3 text-sm text-foreground">
          {value || (
            <span className="text-muted-foreground">
              Nenhum conteúdo para pré-visualizar.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
