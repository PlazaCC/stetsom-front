"use client";

import { BLOCK_BEM_CLASSES } from "@/lib/utils/product";
import { Input } from "@/components/ui/input";
import { AdminTextarea } from "./admin-input";
import { LibraryAssetPicker } from "./library-asset-picker";

const fieldLabel = "mb-1 block text-xs font-medium text-muted-foreground";

type StyleData = {
  fullWidth?: boolean;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundImageUrl?: string;
  customId?: string;
  customCss?: string;
};

interface BlockStyleFormProps {
  /** Block type, used to surface the available BEM classes. */
  blockType: string;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Universal styling editor rendered in every block's "Estilização" tab. Writes
 * to the reserved `data.style` object so it never clashes with block content.
 * The CSS field is scoped to the block instance on render.
 */
export function BlockStyleForm({
  blockType,
  data,
  onChange,
}: BlockStyleFormProps) {
  const style: StyleData =
    data.style && typeof data.style === "object"
      ? (data.style as StyleData)
      : {};

  function update(patch: Partial<StyleData>) {
    onChange({ ...data, style: { ...style, ...patch } });
  }

  const bem = BLOCK_BEM_CLASSES[blockType];
  const classes = bem ? [bem.base, ...bem.elements] : [];

  function appendRule(className: string) {
    const current = str(style.customCss).trimEnd();
    const rule = `.${className} {\n  \n}`;
    update({ customCss: current ? `${current}\n\n${rule}` : rule });
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={style.fullWidth === true}
          onChange={(e) => update({ fullWidth: e.target.checked })}
          className="size-4 rounded border-border accent-primary"
        />
        Preencher a tela toda
      </label>

      <div>
        <label className={fieldLabel}>Cor de fundo</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            aria-label="Selecionar cor de fundo"
            value={str(style.backgroundColor) || "#121212"}
            onChange={(e) => update({ backgroundColor: e.target.value })}
            className="h-9 w-10 shrink-0 cursor-pointer rounded border border-border bg-card"
          />
          <Input
            value={str(style.backgroundColor)}
            onChange={(e) => update({ backgroundColor: e.target.value })}
            placeholder="#121212"
          />
        </div>
      </div>

      <div>
        <label className={fieldLabel}>Imagem de fundo</label>
        <LibraryAssetPicker
          type="IMAGE"
          variant="image"
          value={{
            library_id: str(style.backgroundImage),
            file_url: str(style.backgroundImageUrl),
          }}
          onChange={(a) =>
            update({
              backgroundImage: a?.library_id ?? "",
              backgroundImageUrl: a?.file_url ?? "",
            })
          }
        />
      </div>

      <div>
        <label className={fieldLabel}>Identificador (opcional)</label>
        <Input
          value={str(style.customId)}
          onChange={(e) => update({ customId: e.target.value })}
          placeholder="Gerado automaticamente se vazio"
        />
        <p className="mt-1 text-2xs text-muted-foreground">
          Sobrescreve o id automático do bloco. Usado como id da tag e escopo do
          CSS.
        </p>
      </div>

      <div>
        <label className={fieldLabel}>CSS do bloco</label>
        {classes.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {classes.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => appendRule(c)}
                className="rounded border border-border bg-background px-2 py-0.5 font-mono text-2xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                .{c}
              </button>
            ))}
          </div>
        )}
        <AdminTextarea
          rows={6}
          value={str(style.customCss)}
          onChange={(e) => update({ customCss: e.target.value })}
          placeholder={".blockText__paragraph {\n  color: #e8132a;\n}"}
          className="font-mono"
        />
        <p className="mt-1 text-2xs text-muted-foreground">
          Escreva CSS normal mirando as classes do bloco. Cada regra é aplicada
          apenas a este bloco.
        </p>
      </div>
    </div>
  );
}
