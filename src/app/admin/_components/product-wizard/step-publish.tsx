"use client";

import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import { cn } from "@/lib/utils";
import { CalendarDays, Tag } from "lucide-react";
import {
  deriveLocales,
  type WizardAction,
  type WizardState,
} from "./wizard-store";

const LOCALE_LABELS: Record<string, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
};

function formatLocales(locales: string[]): string {
  const labels = locales.map((l) => LOCALE_LABELS[l] ?? l);
  if (labels.length === 1) return `${labels[0]}.`;
  if (labels.length === 2) return `${labels[0]} e ${labels[1]}.`;
  return `${labels.slice(0, -1).join(", ")} e ${labels.at(-1)}.`;
}

interface StepPublishProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  compact?: boolean;
}

export function StepPublish({
  state,
  dispatch,
  compact = false,
}: StepPublishProps) {
  const locales = formatLocales(deriveLocales(state));
  const variations = state.variations.map((v) => v.label).join(", ");

  return (
    <div>
      <div
        className={cn(
          "grid gap-6",
          compact
            ? "grid-cols-1"
            : "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",
        )}
      >
        <div>
          <AdminLabel className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-muted-foreground" />
            Data de lançamento
          </AdminLabel>
          <div className="flex gap-2">
            <AdminInput
              type="date"
              value={state.launch_date}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { launch_date: e.target.value },
                })
              }
            />
            <AdminInput
              type="time"
              value={state.launch_time}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { launch_time: e.target.value },
                })
              }
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Deixe em branco para publicar imediatamente.
          </p>
        </div>

        <div>
          <AdminLabel className="flex items-center gap-1.5">
            <Tag className="size-4 text-muted-foreground" />
            Status
          </AdminLabel>
          <div className="flex items-center gap-6 pt-2">
            {[
              { label: "Em linha", discontinued: false },
              { label: "Fora de linha", discontinued: true },
            ].map((opt) => (
              <label
                key={opt.label}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full border",
                    state.is_discontinued === opt.discontinued
                      ? "border-primary"
                      : "border-border",
                  )}
                >
                  {state.is_discontinued === opt.discontinued && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                </span>
                <input
                  type="radio"
                  name="publish-discontinued"
                  className="sr-only"
                  checked={state.is_discontinued === opt.discontinued}
                  onChange={() =>
                    dispatch({
                      type: "patch_info",
                      patch: { is_discontinued: opt.discontinued },
                    })
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Idiomas cadastrados</p>
          <p className="mt-1 text-sm font-medium text-foreground">{locales}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Variações do produto</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {variations || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
