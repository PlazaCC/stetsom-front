"use client";

import type { I18nString } from "@/api/stetsom/model";
import { BrFlag, EsFlag, UsFlag } from "@/components/ui/flag-icons";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export type I18nLocale = "pt" | "en" | "es";

export const I18N_LOCALES: {
  id: I18nLocale;
  Flag: React.ComponentType;
  required?: boolean;
  label: string;
}[] = [
  { id: "pt", Flag: BrFlag, label: "PT", required: true },
  { id: "en", Flag: UsFlag, label: "EN" },
  { id: "es", Flag: EsFlag, label: "ES" },
];

/** Locale tabs for use inside a controlled Tabs root. */
export function I18nLocaleTabs({
  value,
  invalid,
  errors,
}: {
  value: I18nString;
  invalid?: Partial<Record<I18nLocale, boolean>>;
  errors?: Partial<Record<I18nLocale, string>>;
}) {
  return (
    <TabsList className="ml-auto gap-0.5">
      {I18N_LOCALES.map(({ id, Flag, label }) => {
        const isInvalid = Boolean(invalid?.[id] || errors?.[id]);
        return (
          <TabsTrigger
            key={id}
            value={id}
            className="flex cursor-pointer gap-1.5"
          >
            <Flag />
            <span className="text-xs leading-2 font-semibold uppercase">
              {label}
            </span>
            {isInvalid ? (
              <span className="size-1.5 rounded-full bg-destructive" />
            ) : (
              !value[id] && (
                <span className="size-1.5 rounded-full bg-primary" />
              )
            )}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
