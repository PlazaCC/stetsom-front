"use client";

import type { I18nString } from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AdminInput, AdminLabel, AdminTextarea } from "./admin-input";

type Locale = "pt" | "en" | "es";

const LOCALES: { id: Locale; label: string; required?: boolean }[] = [
  { id: "pt", label: "PT", required: true },
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
];

interface I18nInputProps {
  label?: string;
  /** Current i18n value — `pt` is the only required key. */
  value: I18nString | undefined;
  onChange: (value: I18nString) => void;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Single field that edits an `I18nString` ({ pt, en?, es? }) through PT/EN/ES
 * tabs. PT is always required. Reused across every CMS form that persists a
 * multilingual value (products, categories, templates, attributes, banners,
 * blocks).
 */
export function I18nInput({
  label,
  value,
  onChange,
  required,
  multiline,
  placeholder,
  className,
}: I18nInputProps) {
  const [active, setActive] = useState<Locale>("pt");
  const current: I18nString = value ?? { pt: "" };

  function set(locale: Locale, text: string) {
    const next: I18nString = { ...current, pt: current.pt ?? "" };
    if (locale === "pt") next.pt = text;
    else next[locale] = text || undefined;
    onChange(next);
  }

  const Field = multiline ? AdminTextarea : AdminInput;

  return (
    <div className={className}>
      {label && (
        <AdminLabel>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </AdminLabel>
      )}
      <div className="mb-1.5 flex gap-1">
        {LOCALES.map((loc) => {
          const filled = loc.id === "pt" ? !!current.pt : !!current[loc.id];
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => setActive(loc.id)}
              className={cn(
                "rounded px-2 py-0.5 text-2xs font-semibold uppercase transition-colors",
                active === loc.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {loc.label}
              {filled && (
                <span
                  className={cn(
                    "ml-1 inline-block size-1.5 rounded-full",
                    active === loc.id ? "bg-background" : "bg-primary",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {LOCALES.map((loc) => (
        <Field
          key={loc.id}
          aria-hidden={active !== loc.id || undefined}
          tabIndex={active !== loc.id ? -1 : undefined}
          className={cn(
            active !== loc.id && "sr-only",
            multiline && "min-h-24",
          )}
          required={loc.id === "pt" && required}
          placeholder={placeholder}
          value={(loc.id === "pt" ? current.pt : current[loc.id]) ?? ""}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => set(loc.id, e.target.value)}
        />
      ))}
    </div>
  );
}
