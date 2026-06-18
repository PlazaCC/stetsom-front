"use client";

import {
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
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

interface StepGeneralProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  categories: CategoryOption[];
  lines: LineOption[];
}

export function StepGeneral({
  state,
  dispatch,
  categories,
  lines,
}: StepGeneralProps) {
  const categoryLines = lines.filter(
    (l) => l.category_id === state.category_id,
  );

  return (
    <div className="rounded-[16px] border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-xl font-bold text-foreground">
          Dados Gerais do Produto
        </h2>
      </div>

      <div className="space-y-6 p-6">
        <ImageGallery
          images={state.images}
          onChange={(images: WizardImage[]) =>
            dispatch({ type: "set_images", images })
          }
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <I18nInput
            label="Nome do produto"
            required
            value={state.name}
            onChange={(name) =>
              dispatch({ type: "patch_info", patch: { name } })
            }
            placeholder="Ex: ST-4000EQ"
          />

          <div>
            <AdminLabel className="flex items-center gap-1.5">
              <Tag className="size-4 text-muted-foreground" />
              Status
            </AdminLabel>
            <div className="flex items-center gap-6 pt-2">
              {[
                { label: "Em linha", discontinued: false },
                { label: "Descontinuado", discontinued: true },
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
                    name="status-discontinued"
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
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <AdminLabel>
              Categoria<span className="ml-0.5 text-destructive">*</span>
            </AdminLabel>
            <AdminSelect
              value={state.category_id}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { category_id: e.target.value },
                })
              }
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </AdminSelect>
          </div>

          <div>
            <AdminLabel>
              Linha<span className="ml-0.5 text-destructive">*</span>
            </AdminLabel>
            <AdminSelect
              value={state.line_id}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { line_id: e.target.value },
                })
              }
              disabled={!state.category_id || categoryLines.length === 0}
            >
              <option value="">
                {categoryLines.length === 0 ? "Nenhuma" : "Selecione..."}
              </option>
              {categoryLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </AdminSelect>
          </div>
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
      </div>
    </div>
  );
}
