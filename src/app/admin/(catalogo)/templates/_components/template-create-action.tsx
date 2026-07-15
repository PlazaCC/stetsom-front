"use client";

import type { PublicCategory } from "@/api/stetsom";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

interface TemplateCreateActionProps {
  categories: PublicCategory[];
}

export function TemplateCreateAction({
  categories,
}: Readonly<TemplateCreateActionProps>) {
  const router = useRouter();
  const pickerId = useId();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={pickerId}
        onClick={() => setOpen((value) => !value)}
        disabled={categories.length === 0}
        className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-60"
      >
        <Plus className="size-4" />
        Novo template
      </button>
      {open && (
        <div
          id={pickerId}
          role="group"
          aria-label="Escolha a categoria"
          className="absolute top-11 right-0 z-10 w-56 rounded-md border border-border bg-card p-1 shadow-cms-card-lg"
        >
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            Escolha a categoria
          </p>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(`/admin/categorias/${category.id}/templates/novo`);
              }}
              className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted"
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
