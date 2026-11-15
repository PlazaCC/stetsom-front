"use client";

import { getGetApiConfigQueryKey, useGetApiConfig } from "@/api/stetsom";
import { patchApiConfig } from "@/api/stetsom/endpoints/config/config";
import type { I18nString } from "@/api/stetsom/model";
import type { WarrantyFloatConfig } from "@/api/stetsom/model/warrantyFloatConfig";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { getApiErrorMessage } from "@/lib/api/error-utils";
import { WARRANTY_FLOAT_ROUTE_OPTIONS } from "@/lib/warranty-float";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function WarrantyFloatPanel({
  onStateChange,
}: {
  onStateChange: (state: {
    save: () => void;
    dirty: boolean;
    isPending: boolean;
  }) => void;
}) {
  const queryClient = useQueryClient();
  const toast = useAdminToast();
  const { data, isError, isLoading, refetch } = useGetApiConfig();
  const [localConfig, setLocalConfig] = useState<WarrantyFloatConfig | null>(
    null,
  );
  const [edited, setEdited] = useState(false);
  const config = localConfig ?? data?.warranty_float;

  function update(next: WarrantyFloatConfig) {
    setEdited(true);
    setLocalConfig(next);
  }

  const { isPending, mutate } = useMutation({
    mutationFn: () => {
      if (!config) throw new Error("Configuração de garantia indisponível.");
      return patchApiConfig({ warranty_float: config });
    },
    onSuccess: async () => {
      setEdited(false);
      setLocalConfig(null);
      await queryClient.invalidateQueries({
        queryKey: getGetApiConfigQueryKey(),
      });
      toast.success("Configuração de garantia salva com sucesso");
    },
    onError: (error) =>
      toast.error(
        "Não foi possível salvar a configuração de garantia",
        getApiErrorMessage(error, "Tente novamente."),
      ),
  });

  const save = useCallback(() => {
    if (config) mutate();
  }, [config, mutate]);

  useEffect(() => {
    onStateChange({ save, dirty: edited && Boolean(config), isPending });
  }, [config, edited, isPending, onStateChange, save]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="space-y-3 p-4 text-sm text-muted-foreground">
        <p>
          {isError
            ? "Não foi possível carregar a configuração de garantia."
            : "A configuração de garantia ainda não foi cadastrada."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-primary underline underline-offset-4"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  function updateI18n(field: "label" | "href", value: I18nString) {
    update(
      field === "label"
        ? ({ ...config, label: value } as WarrantyFloatConfig)
        : ({ ...config, href: value } as WarrantyFloatConfig),
    );
  }

  return (
    <div className="space-y-4 p-4">
      <AdminFormSection
        title="Botão flutuante de garantia"
        description="Configuração global administrada pela Home e aplicada às rotas selecionadas."
      >
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Checkbox
              checked={config.enabled}
              onCheckedChange={(checked) =>
                update({ ...config, enabled: checked === true })
              }
            />
            Exibir botão flutuante
          </label>

          <div className="grid gap-5 rounded-lg border border-border bg-muted/20 p-4">
            <I18nInput
              label="Texto do botão"
              required
              value={config.label}
              placeholder="Garantia"
              onChange={(value) => updateI18n("label", value)}
            />
            <I18nInput
              label="URL do sistema de garantia"
              required
              type="url"
              value={config.href}
              placeholder="https://..."
              onChange={(value) => updateI18n("href", value)}
            />
            <p className="-mt-2 text-xs text-muted-foreground">
              PT é obrigatório. Quando EN ou ES estiverem vazios, o site usa o
              valor em português automaticamente.
            </p>
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Exibir nas rotas"
        description="Escolha em quais áreas públicas o botão deve aparecer."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {WARRANTY_FLOAT_ROUTE_OPTIONS.map(({ key, label, description }) => (
            <label
              key={String(key)}
              className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/50"
            >
              <Checkbox
                checked={config.visible_on[key]}
                onCheckedChange={(checked) =>
                  update({
                    ...config,
                    visible_on: {
                      ...config.visible_on,
                      [key]: checked === true,
                    },
                  })
                }
              />
              <span>
                {label}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({description})
                </span>
              </span>
            </label>
          ))}
        </div>
      </AdminFormSection>
    </div>
  );
}
