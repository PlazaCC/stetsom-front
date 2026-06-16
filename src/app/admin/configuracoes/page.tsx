"use client";

import { AdminFormPage } from "@/app/admin/_components/crud/admin-form-page";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import { useGetApiConfig } from "@/api/stetsom";
import { patchApiConfig } from "@/api/stetsom/endpoints/config/config";
import type { CmsConfig, PatchApiConfigBody } from "@/api/stetsom/model";
import { useMutation } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "../_components/admin-page-header";
import { AdminPanel } from "../_components/admin-panel";

function ConfigForm({ initialConfig }: { initialConfig: CmsConfig }) {
  const [config, setConfig] = useState<CmsConfig>(initialConfig);
  const { mutate: updateConfig, isPending } = useMutation({
    mutationFn: (body: PatchApiConfigBody) => patchApiConfig(body),
  });

  function handleChange(key: keyof CmsConfig, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateConfig(config as PatchApiConfigBody, {
      onSuccess: () => toast.success("Configurações salvas com sucesso"),
      onError: (err) =>
        toast.error("Erro ao salvar configurações", {
          description: err.message,
        }),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <AdminFormPage
        aside={
          <div className="space-y-4">
            <AdminFormSection title="Publicação">
              <p className="text-xs text-muted-foreground">
                As configurações afetam todas as páginas do site imediatamente
                após salvar.
              </p>
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-md bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {isPending ? "Salvando..." : "Salvar configurações"}
                </button>
              </div>
            </AdminFormSection>
          </div>
        }
      >
        <AdminFormSection
          title="Informações da Empresa"
          description="Dados de contato e identificação exibidos no site."
        >
          <div className="space-y-4">
            <div>
              <AdminLabel>Nome da empresa</AdminLabel>
              <AdminInput
                value={config.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <AdminLabel>E-mail</AdminLabel>
                <AdminInput
                  type="email"
                  value={config.company_email}
                  onChange={(e) =>
                    handleChange("company_email", e.target.value)
                  }
                />
              </div>
              <div>
                <AdminLabel>Telefone</AdminLabel>
                <AdminInput
                  value={config.company_phone}
                  onChange={(e) =>
                    handleChange("company_phone", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <AdminLabel>WhatsApp</AdminLabel>
              <AdminInput
                value={config.company_whatsapp}
                onChange={(e) =>
                  handleChange("company_whatsapp", e.target.value)
                }
              />
            </div>
            <div>
              <AdminLabel>Endereço</AdminLabel>
              <AdminInput
                value={config.company_address}
                onChange={(e) =>
                  handleChange("company_address", e.target.value)
                }
              />
            </div>
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Redes Sociais"
          description="URLs completas dos perfis oficiais."
        >
          <div className="space-y-4">
            <div>
              <AdminLabel>Instagram</AdminLabel>
              <AdminInput
                type="url"
                value={config.social_instagram ?? ""}
                onChange={(e) =>
                  handleChange("social_instagram", e.target.value)
                }
                placeholder="https://instagram.com/stetsom"
              />
            </div>
            <div>
              <AdminLabel>Facebook</AdminLabel>
              <AdminInput
                type="url"
                value={config.social_facebook ?? ""}
                onChange={(e) =>
                  handleChange("social_facebook", e.target.value)
                }
                placeholder="https://facebook.com/stetsom"
              />
            </div>
            <div>
              <AdminLabel>YouTube</AdminLabel>
              <AdminInput
                type="url"
                value={config.social_youtube ?? ""}
                onChange={(e) => handleChange("social_youtube", e.target.value)}
                placeholder="https://youtube.com/@stetsom"
              />
            </div>
          </div>
        </AdminFormSection>
      </AdminFormPage>
    </form>
  );
}

export default function AdminConfiguracoesPage() {
  const configQuery = useGetApiConfig();

  return (
    <div className="flex flex-col gap-5">
      <AdminPanel className="p-5">
        <AdminPageHeader title="Configurações" icon={Settings} />
      </AdminPanel>

      {configQuery.isLoading || !configQuery.data ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : (
        <ConfigForm
          key={configQuery.dataUpdatedAt}
          initialConfig={configQuery.data}
        />
      )}
    </div>
  );
}
