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
import {
  AlignLeft,
  ArrowLeft,
  ChevronRight,
  GripVertical,
  Images,
  Info,
  Tag,
  Type,
  type LucideIcon,
} from "lucide-react";
import { ImageGallery } from "./image-gallery";
import type { GeneralField } from "./editor-target";
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
  /** The drilled-in field, or undefined for the section overview. */
  field?: GeneralField;
  onOpenField: (field: GeneralField) => void;
  onBack: () => void;
}

/**
 * Contextual editor for the general product data. With no `field` it shows an
 * overview menu of the editable regions; selecting one (or clicking it in the
 * preview) drills into that field's inputs. Replaces the old monolithic
 * `StepGeneral`.
 */
export function GeneralEditor({
  state,
  dispatch,
  categories,
  lines,
  field,
  onOpenField,
  onBack,
}: GeneralEditorProps) {
  if (!field) {
    return (
      <GeneralOverview
        state={state}
        categories={categories}
        onOpenField={onOpenField}
      />
    );
  }

  return (
    <div
      key={field}
      className="flex animate-in flex-col gap-4 duration-150 fade-in-0"
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Geral
      </button>

      {field === "title" && (
        <div className="flex flex-col gap-4">
          <I18nInput
            label="Nome do produto"
            required
            value={state.name}
            onChange={(name) =>
              dispatch({ type: "patch_info", patch: { name } })
            }
            placeholder="Ex: ST-4000EQ"
          />
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
      )}

      {field === "description" && (
        <I18nInput
          label="Descrição"
          multiline
          value={state.description}
          onChange={(description) =>
            dispatch({ type: "patch_info", patch: { description } })
          }
          placeholder="Descrição do produto..."
        />
      )}

      {field === "category" && (
        <CategoryFields
          state={state}
          dispatch={dispatch}
          categories={categories}
          lines={lines}
        />
      )}

      {field === "images" && (
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
      )}
    </div>
  );
}

const OVERVIEW_ITEMS: {
  field: GeneralField;
  label: string;
  icon: LucideIcon;
}[] = [
  { field: "title", label: "Título", icon: Type },
  { field: "description", label: "Descrição", icon: AlignLeft },
  { field: "category", label: "Categoria e linha", icon: Tag },
  { field: "images", label: "Imagens", icon: Images },
];

function GeneralOverview({
  state,
  categories,
  onOpenField,
}: {
  state: WizardState;
  categories: CategoryOption[];
  onOpenField: (field: GeneralField) => void;
}) {
  const categoryName =
    categories.find((c) => c.id === state.category_id)?.name ?? "—";
  const preview: Record<GeneralField, string> = {
    title: state.name.pt || "—",
    description: state.description.pt || "—",
    category: categoryName,
    images:
      state.images.length > 0
        ? `${state.images.length} imagem(ns)`
        : "Nenhuma imagem",
  };

  return (
    <div className="flex animate-in flex-col gap-2 duration-150 fade-in-0">
      <p className="px-1 text-xs text-muted-foreground">
        Selecione um item para editar — ou clique direto na página.
      </p>
      {OVERVIEW_ITEMS.map(({ field, label, icon: Icon }) => (
        <button
          key={field}
          type="button"
          onClick={() => onOpenField(field)}
          className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-foreground">
              {label}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {preview[field]}
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}

function CategoryFields({
  state,
  dispatch,
  categories,
  lines,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  categories: CategoryOption[];
  lines: LineOption[];
}) {
  const categoryLines = lines.filter(
    (l) => l.category_id === state.category_id,
  );
  const currentCategory =
    categories.find((c) => c.id === state.category_id) ?? null;
  const currentLine = categoryLines.find((l) => l.id === state.line_id) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel>Categoria</FieldLabel>
        <FieldContent>
          <Combobox
            items={categories}
            defaultValue={currentCategory}
            itemToStringLabel={(item: CategoryOption) => item.name}
            onValueChange={(value: CategoryOption | null) =>
              dispatch({
                type: "patch_info",
                patch: { category_id: value?.id ?? "" },
              })
            }
          >
            <ComboboxInput placeholder="Selecione uma categoria" />
            <ComboboxContent>
              <ComboboxEmpty>Nenhuma categoria encontrada.</ComboboxEmpty>
              <ComboboxList>
                {(item: CategoryOption) => (
                  <ComboboxItem key={item.id} value={item}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Linha</FieldLabel>
        <FieldContent>
          {/* Remount on category change so a stale line value cannot linger. */}
          <Combobox
            key={state.category_id}
            items={categoryLines}
            defaultValue={currentLine}
            itemToStringLabel={(item: LineOption) => item.name}
            onValueChange={(value: LineOption | null) =>
              dispatch({
                type: "patch_info",
                patch: { line_id: value?.id ?? "" },
              })
            }
          >
            <ComboboxInput
              placeholder={
                categoryLines.length ? "Selecione uma linha" : "Nenhuma linha"
              }
              disabled={!categoryLines.length}
            />
            <ComboboxContent>
              <ComboboxEmpty>Nenhuma linha encontrada.</ComboboxEmpty>
              <ComboboxList>
                {(item: LineOption) => (
                  <ComboboxItem key={item.id} value={item}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </FieldContent>
      </Field>
    </div>
  );
}
