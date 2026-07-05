"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isReservedRedirectPath } from "@/lib/redirects/path";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const SITE_ORIGIN = "https://www.stetsom.com.br";

/** Inline validation mirroring the backend rules (backend is authoritative). */
function validatePath(path: string): string | null {
  const p = path.trim();
  if (!p) return null;
  if (!p.startsWith("/")) return "Deve começar com /";
  if (p.includes("://") || p.includes("#"))
    return "Não pode conter domínio ou #";
  if (/\s/.test(p)) return "Não pode conter espaços";
  if (isReservedRedirectPath(p.toLowerCase()))
    return "Caminho reservado por uma rota do site";
  return null;
}

interface AssetRedirectsTabProps {
  value: string[];
  onChange: (value: string[]) => void;
}

/**
 * Editor for a manual's legacy redirect paths. Each entry 301s to the asset's
 * active version. Controlled by the dialog form (RHF `Controller`).
 */
export function AssetRedirectsTab({ value, onChange }: AssetRedirectsTabProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function updateAt(index: number, next: string) {
    onChange(value.map((v, i) => (i === index ? next : v)));
  }
  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  async function copyPublicUrl(index: number, path: string) {
    try {
      await navigator.clipboard.writeText(`${SITE_ORIGIN}${path}`);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Caminhos legados (QR codes) que redirecionam permanentemente para a
        versão atual deste manual.
      </p>

      {value.length === 0 ? (
        <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
          Nenhum redirecionamento cadastrado.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {value.map((path, index) => {
            const error = validatePath(path);
            return (
              <li key={index} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Input
                    value={path}
                    placeholder="/produto-x/manuais/manual-xpto"
                    aria-invalid={!!error}
                    onChange={(e) => updateAt(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Copiar URL pública"
                    disabled={!path.trim() || !!error}
                    onClick={() => copyPublicUrl(index, path)}
                  >
                    {copiedIndex === index ? (
                      <Check className="text-green-600" />
                    ) : (
                      <Copy />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remover caminho"
                    onClick={() => removeAt(index)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
                {error ? (
                  <p className="text-2xs text-destructive">{error}</p>
                ) : path.trim() ? (
                  <p className="truncate text-2xs text-muted-foreground">
                    → versão atual · {SITE_ORIGIN}
                    {path}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, ""])}
        >
          <Plus />
          Adicionar caminho
        </Button>
      </div>
    </div>
  );
}
