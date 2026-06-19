"use client";

import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GripVertical, Info } from "lucide-react";
import { ImageGallery } from "./image-gallery";
import type { WizardAction, WizardImage, WizardState } from "./wizard-store";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

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

  console.log(categoryLines.length);

  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-card border border-border bg-card">
      <div className="border-b px-5 py-2.5">
        <h2 className="text-sm font-semibold">Dados Gerais do Produto</h2>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-auto overflow-x-hidden pt-2">
        <div className="grid grid-cols-1 gap-4 px-5 md:grid-cols-2">
          <I18nInput
            label="Nome do produto"
            required
            value={state.name}
            onChange={(name) =>
              dispatch({ type: "patch_info", patch: { name } })
            }
            placeholder="Ex: ST-4000EQ"
          />

          <I18nInput
            label="Descrição"
            multiline
            value={state.description}
            onChange={(description) =>
              dispatch({ type: "patch_info", patch: { description } })
            }
            placeholder="Descrição do produto..."
            className="col-span-2"
          />

          <Field>
            <FieldLabel>Categoria</FieldLabel>
            <FieldContent>
              <Combobox
                items={categories}
                defaultValue={undefined}
                itemToStringLabel={(item: CategoryOption) => item.name}
                onValueChange={(value) => {
                  if (value) {
                    return;
                  }

                  dispatch({
                    type: "patch_info",
                    patch: { category_id: value!.id },
                  });
                }}
              >
                <ComboboxInput placeholder="Selecione uma categoria" />
                <ComboboxContent>
                  <ComboboxEmpty>Nenhuma categoria encontrada.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
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
                items={categoryLines}
                itemToStringLabel={(item: CategoryOption) => item.name}
              >
                <ComboboxInput
                  placeholder="Selecione uma categoria"
                  disabled={!categoryLines.length}
                />
                <ComboboxContent>
                  <ComboboxEmpty>Nenhuma linha encontrada.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 border-t px-5 pt-5">
            <h3 className="text-sm font-semibold">Imagens</h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3" />
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  Para ordenar as imagens basta segurar e arrastar no icone{" "}
                  <GripVertical className="inline size-3 align-middle" />
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="px-5 pt-2.5 pb-5">
            <ImageGallery
              images={state.images}
              onChange={(images: WizardImage[]) =>
                dispatch({ type: "set_images", images })
              }
            />
          </div>
        </div>
      </div>
    </section>

    /* <div>
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
          </div>*/

    // <div className="overflow-hidden rounded-card border border-border bg-card">
    //   <div className="border-b border-border px-6 py-4">
    //     <h2 className="text-xl font-bold text-foreground">
    //       Dados Gerais do Produto
    //     </h2>
    //   </div>

    //   <div className="flex flex-col gap-6 p-6">
    //     <ImageGallery
    //       images={state.images}
    //       onChange={(images: WizardImage[]) =>
    //         dispatch({ type: "set_images", images })
    //       }
    //     />

    //     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    //       <div>
    //         <AdminLabel>
    //           Categoria<span className="ml-0.5 text-destructive">*</span>
    //         </AdminLabel>
    //         {/* <AdminSelect
    //           value={state.category_id}
    //           onChange={(e) =>
    //             dispatch({
    //               type: "patch_info",
    //               patch: { category_id: e.target.value },
    //             })
    //           }
    //         >
    //           <option value="">Selecione...</option>
    //           {categories.map((cat) => (
    //             <option key={cat.id} value={cat.id}>
    //               {cat.name}
    //             </option>
    //           ))}
    //         </AdminSelect> */}
    //       </div>

    //       <div>
    //         <AdminLabel>
    //           Linha<span className="ml-0.5 text-destructive">*</span>
    //         </AdminLabel>
    //         {/* <AdminSelect
    //           value={state.line_id}
    //           onChange={(e) =>
    //             dispatch({
    //               type: "patch_info",
    //               patch: { line_id: e.target.value },
    //             })
    //           }
    //           disabled={!state.category_id || categoryLines.length === 0}
    //         >
    //           <option value="">
    //             {categoryLines.length === 0 ? "Nenhuma" : "Selecione..."}
    //           </option>
    //           {categoryLines.map((line) => (
    //             <option key={line.id} value={line.id}>
    //               {line.name}
    //             </option>
    //           ))}
    //         </AdminSelect> */}
    //       </div>
    //     </div>

    //   </div>
    // </div>
  );
}
