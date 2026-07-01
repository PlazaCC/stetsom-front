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
}

export function GeneralEditor({
  state,
  dispatch,
  categories,
  lines,
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

      <I18nInput
        label="Descrição"
        multiline
        value={state.description}
        onChange={(description) =>
          dispatch({ type: "patch_info", patch: { description } })
        }
        placeholder="Descrição do produto..."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
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
