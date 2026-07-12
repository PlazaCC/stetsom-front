"use client";

import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GripVertical, Info } from "lucide-react";
import { ImageGallery } from "./image-gallery";
import type { WizardAction, WizardImage, WizardState } from "./wizard-store";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface LineOption {
  id: string;
  name: string;
  category_id: string;
}

interface GeneralEditorProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  categories: CategoryOption[];
  lines: LineOption[];
  compact?: boolean;
}

interface EntityComboboxProps<T extends { id: string; name: string }> {
  label: string;
  items: T[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  placeholder: string;
  emptyMessage: string;
  disabled?: boolean;
  /** Remounts the combobox (clearing its internal input) when this changes. */
  resetKey?: string;
}

function EntityCombobox<T extends { id: string; name: string }>({
  label,
  items,
  value,
  onValueChange,
  placeholder,
  emptyMessage,
  disabled,
  resetKey,
}: EntityComboboxProps<T>) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <Combobox
          key={resetKey}
          items={items}
          value={value}
          itemToStringLabel={(item: T) => item.name}
          onValueChange={onValueChange}
        >
          <ComboboxInput placeholder={placeholder} disabled={disabled} />
          <ComboboxContent>
            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
            <ComboboxList>
              {(item: T) => (
                <ComboboxItem key={item.id} value={item}>
                  {item.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </FieldContent>
    </Field>
  );
}

export function GeneralEditor({
  state,
  dispatch,
  categories,
  lines,
  compact = false,
}: GeneralEditorProps) {
  const categoryLines = lines.filter(
    (l) => l.category_id === state.category_id,
  );
  const currentCategory =
    categories.find((c) => c.id === state.category_id) ?? null;
  const currentLine = categoryLines.find((l) => l.id === state.line_id) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <I18nInput
        label="Nome do produto"
        required
        value={state.name}
        onChange={(name) => dispatch({ type: "patch_info", patch: { name } })}
        placeholder="Ex: ST-4000EQ"
      />

      <div
        className={cn(
          "grid gap-4",
          compact
            ? "grid-cols-1"
            : "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
        )}
      >
        <Field>
          <FieldLabel>SKU</FieldLabel>
          <FieldContent>
            <AdminInput
              value={state.sku}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { sku: e.target.value },
                })
              }
              placeholder="Ex: ST-4000EQ-1"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Slug (URL)</FieldLabel>
          <FieldContent>
            <AdminInput
              value={state.slug.pt}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { slug: { ...state.slug, pt: e.target.value } },
                })
              }
              placeholder="st-4000eq"
            />
          </FieldContent>
        </Field>
      </div>

      <I18nInput
        label="Descrição"
        multiline
        value={state.description}
        onChange={(description) =>
          dispatch({ type: "patch_info", patch: { description } })
        }
        placeholder="Descrição do produto..."
      />

      <div
        className={cn(
          "grid gap-4",
          compact
            ? "grid-cols-1"
            : "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
        )}
      >
        <Field>
          <FieldLabel>URL App Store</FieldLabel>
          <FieldContent>
            <AdminInput
              type="url"
              value={state.app_store_url}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { app_store_url: e.target.value },
                })
              }
              placeholder="https://apps.apple.com/..."
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>URL Play Store</FieldLabel>
          <FieldContent>
            <AdminInput
              type="url"
              value={state.play_store_url}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { play_store_url: e.target.value },
                })
              }
              placeholder="https://play.google.com/..."
            />
          </FieldContent>
        </Field>
      </div>

      <div
        className={cn(
          "grid gap-4",
          compact
            ? "grid-cols-1"
            : "grid-cols-[repeat(auto-fit,minmax(150px,1fr))]",
        )}
      >
        <EntityCombobox
          label="Categoria"
          items={categories}
          value={currentCategory}
          onValueChange={(value) =>
            dispatch({
              type: "patch_info",
              patch: { category_id: value?.id ?? "" },
            })
          }
          placeholder="Selecione uma categoria"
          emptyMessage="Nenhuma categoria encontrada."
        />

        <EntityCombobox
          resetKey={state.category_id}
          label="Linha"
          items={categoryLines}
          value={currentLine}
          onValueChange={(value) =>
            dispatch({
              type: "patch_info",
              patch: { line_id: value?.id ?? "" },
            })
          }
          placeholder={
            categoryLines.length ? "Selecione uma linha" : "Nenhuma linha"
          }
          emptyMessage="Nenhuma linha encontrada."
          disabled={!categoryLines.length}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <AdminLabel className="mb-0">Imagens</AdminLabel>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-3" />
            </TooltipTrigger>
            <TooltipContent>
              <span>
                Para ordenar as imagens basta segurar e arrastar no ícone{" "}
                <GripVertical className="inline size-3 align-middle" />
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
        <ImageGallery
          images={state.images}
          onChange={(images: WizardImage[]) =>
            dispatch({ type: "set_images", images })
          }
        />
      </div>
    </div>
  );
}
